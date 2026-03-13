import { inngest } from '@/lib/inngest/client'
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from '@/lib/inngest/prompts'
import { sendNewsSummaryEmail, sendPriceAlertEmail, sendWelcomeEmail } from '@/lib/nodemailer'
import { MarketNewsArticle, User } from '@/shared/types/global'

import { getAllAlertsForMonitoring, updateAlertLastTriggered } from '../actions/alert.actions'
import { getNews, getStockDetails } from '../actions/finnhub.actions'
import { getAllUserForNewsEmailAction } from '../actions/user.action'
import { getWatchlistSymbolsByEmail } from '../actions/watchlist.actions'
import { getFormattedTodayDate } from '../utils'

export const USER_EVENT = {
  CREATE: 'app/user.created',
}

export const sendSignUpEmail = inngest.createFunction(
  { id: 'sign-up-email' },
  { event: 'app/user.created' },
  async ({ event, step }) => {
    const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

    const response = await step.ai.infer('generate-welcome-intro', {
      model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
      body: {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
    })

    await step.run('send-welcome-email', async () => {
      const part = response.candidates?.[0]?.content?.parts?.[0]
      const introText =
        (part && 'text' in part ? part.text : null) ||
        'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.'

      const {
        data: { email, name },
      } = event

      return await sendWelcomeEmail({ email, name, intro: introText })
    })

    return {
      success: true,
      message: 'Welcome email sent successfully',
    }
  }
)

export const sendDailyNewsSummary = inngest.createFunction(
  { id: 'daily-news-summary' },
  [
    { event: 'app/send.daily.news' },
    { cron: '0 12 * * *' },
  ] /** format: min hour dayOfMonth month dayOfWeek */,
  async ({ step }) => {
    // Step #1: Get all users for news delivery
    const users = await step.run('get-all-users', getAllUserForNewsEmailAction)

    console.log('Fetched users for news email:', users) // Debug log

    if (!users.data || users.data.length === 0)
      return { success: false, message: 'No users found for news email' }

    // Step #2: For each user, get watchlist symbols -> fetch news (fallback to general)
    const results = await step.run('fetch-user-news', async () => {
      const perUser: Array<{ user: User; articles: MarketNewsArticle[] }> = []
      for (const user of users.data as User[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email)
          let articles = await getNews(symbols)
          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6)
          // If still empty, fallback to general
          if (!articles || articles.length === 0) {
            articles = await getNews()
            articles = (articles || []).slice(0, 6)
          }
          perUser.push({ user, articles })
        } catch (e) {
          console.error('daily-news: error preparing user news', user.email, e)
          perUser.push({ user, articles: [] })
        }
      }
      return perUser
    })

    // Step #3: (placeholder) Summarize news via AI
    const userNewsSummaries: { user: User; newsContent: string | null }[] = []

    for (const { user, articles } of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
          '{{newsData}}',
          JSON.stringify(articles, null, 2)
        )

        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
          body: {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          },
        })

        const part = response.candidates?.[0]?.content?.parts?.[0]
        const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

        userNewsSummaries.push({ user, newsContent })
      } catch (e) {
        console.error('Failed to summarize news for : ', e, user.email)
        userNewsSummaries.push({ user, newsContent: null })
      }
    }

    // Step #4: (placeholder) Send the emails
    await step.run('send-news-emails', async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false

          return await sendNewsSummaryEmail({
            email: user.email,
            date: getFormattedTodayDate(),
            newsContent,
          })
        })
      )
    })

    return { success: true, message: 'Daily news summary emails sent successfully' }
  }
)

export const checkPriceAlerts = inngest.createFunction(
  { id: 'check-price-alerts' },
  [
    { event: 'app/check.price.alerts' },
    { cron: '*/60 * * * *' }, // Every 15 minutes
  ],
  async ({ step }) => {
    // Step #1: Get all active alerts with user emails
    const alerts = await step.run('get-all-alerts', getAllAlertsForMonitoring)

    console.log('Fetched alerts for monitoring:', alerts) // Debug log

    if (!alerts || alerts.length === 0) return { success: false, message: 'No alerts to monitor' }

    // Step #2: Get unique symbols and fetch current prices in batch
    const uniqueSymbols = [...new Set(alerts.map((a) => a.symbol))]

    const stockDetails = await step.run('fetch-current-prices', async () => {
      return await getStockDetails(uniqueSymbols)
    })

    // Build a price map: { AAPL: 175.34, ... }
    const priceMap = Object.fromEntries(stockDetails.map((s) => [s.symbol, s.price]))

    // Step #3: Check each alert against the current price
    await step.run('evaluate-and-notify', async () => {
      await Promise.all(
        alerts.map(async (alert) => {
          const currentPrice = priceMap[alert.symbol]
          if (currentPrice === undefined) return

          const { threshold, condition } = alert

          const triggered =
            condition === 'greater'
              ? currentPrice > threshold
              : condition === 'less'
                ? currentPrice < threshold
                : currentPrice === threshold

          if (!triggered) return

          await sendPriceAlertEmail({
            email: alert.email,
            symbol: alert.symbol,
            company: alert.company,
            alertName: alert.alertName,
            currentPrice,
            threshold,
            condition,
            alertType: alert.alertType,
          })

          // Mark alert as triggered — for 'once' it won't fire again (cooldown = Infinity)
          // For all frequencies: set isTriggered flag for UI badge display
          await updateAlertLastTriggered(alert.alertId)
          console.log(`Alert triggered for ${alert.email}: ${alert.symbol} @ $${currentPrice}`)
        })
      )
    })

    return {
      success: true,
      message: `Checked ${alerts.length} alerts for ${uniqueSymbols.length} symbols`,
    }
  }
)
