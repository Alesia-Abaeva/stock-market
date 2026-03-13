import nodemailer from 'nodemailer'

import { WelcomeEmailData } from '@/shared/types/global'

import {
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  STOCK_ALERT_LOWER_EMAIL_TEMPLATE,
  STOCK_ALERT_UPPER_EMAIL_TEMPLATE,
  VOLUME_ALERT_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from './template'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{intro}}', intro)

  const mailOptions = {
    from: `"Signalist" <alesia.litvinenko@gmail.com>`,
    to: email,
    subject: `Welcome to Signalist - your stock market toolkit is ready!`,
    text: 'Thanks for joining Signalist',
    html: htmlTemplate,
  }

  await transporter.sendMail(mailOptions)
}

export const sendPriceAlertEmail = async ({
  email,
  symbol,
  company,
  alertName,
  currentPrice,
  threshold,
  condition,
  alertType,
}: {
  email: string
  symbol: string
  company: string
  alertName: string
  currentPrice: number
  threshold: number
  condition: string
  alertType: string
}): Promise<void> => {
  const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  const formattedPrice = `$${currentPrice.toFixed(2)}`
  const formattedThreshold = `$${threshold.toFixed(2)}`

  let htmlTemplate: string
  let subject: string

  if (alertType === 'upper') {
    subject = `📈 Price Above Alert: ${symbol} hit $${currentPrice.toFixed(2)}`
    htmlTemplate = STOCK_ALERT_UPPER_EMAIL_TEMPLATE.replace(/{{symbol}}/g, symbol)
      .replace(/{{company}}/g, company)
      .replace(/{{currentPrice}}/g, formattedPrice)
      .replace(/{{targetPrice}}/g, formattedThreshold)
      .replace(/{{timestamp}}/g, timestamp)
  } else if (alertType === 'lower') {
    subject = `📉 Price Below Alert: ${symbol} dropped to $${currentPrice.toFixed(2)}`
    htmlTemplate = STOCK_ALERT_LOWER_EMAIL_TEMPLATE.replace(/{{symbol}}/g, symbol)
      .replace(/{{company}}/g, company)
      .replace(/{{currentPrice}}/g, formattedPrice)
      .replace(/{{targetPrice}}/g, formattedThreshold)
      .replace(/{{timestamp}}/g, timestamp)
  } else {
    // fallback: generic price alert
    subject = `🔔 Price Alert: ${symbol} — ${alertName}`
    const conditionLabel =
      condition === 'greater' ? 'above' : condition === 'less' ? 'below' : 'equal to'
    htmlTemplate = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#141414;color:#e5e7eb;padding:32px;border-radius:12px;border:1px solid #30333a">
        <h2 style="color:#facc15;margin-bottom:8px">🔔 Price Alert Triggered</h2>
        <p style="color:#9ca3af;margin-bottom:24px">Your alert <strong style="color:#fff">${alertName}</strong> has been triggered for <strong style="color:#fff">${company} (${symbol})</strong></p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;color:#9ca3af;border-bottom:1px solid #30333a">Condition</td><td style="padding:10px 0;text-align:right;color:#fff">Price ${conditionLabel} ${formattedThreshold}</td></tr>
          <tr><td style="padding:10px 0;color:#9ca3af">Current Price</td><td style="padding:10px 0;text-align:right;color:#facc15;font-size:20px;font-weight:bold">${formattedPrice}</td></tr>
        </table>
      </div>
    `
  }

  await transporter.sendMail({
    from: `"Signalist Alerts" <alesia.litvinenko@gmail.com>`,
    to: email,
    subject,
    html: htmlTemplate,
    text: `Price Alert: ${symbol} current price ${formattedPrice} triggered your ${alertType} alert.`,
  })
}

export const sendVolumeAlertEmail = async ({
  email,
  symbol,
  company,
  currentPrice,
  currentVolume,
  averageVolume,
  changePercent,
}: {
  email: string
  symbol: string
  company: string
  currentPrice: number
  currentVolume: number
  averageVolume: number
  changePercent: number
}): Promise<void> => {
  const timestamp = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  const isPositive = changePercent >= 0
  const priceColor = isPositive ? '#10b981' : '#ef4444'
  const changeDirection = isPositive ? '+' : ''
  const volumeSpike =
    averageVolume > 0 ? `${((currentVolume / averageVolume) * 100).toFixed(0)}%` : 'N/A'

  const htmlTemplate = VOLUME_ALERT_EMAIL_TEMPLATE.replace(/{{symbol}}/g, symbol)
    .replace(/{{company}}/g, company)
    .replace(/{{currentPrice}}/g, `$${currentPrice.toFixed(2)}`)
    .replace(/{{currentVolume}}/g, (currentVolume / 1_000_000).toFixed(2))
    .replace(/{{averageVolume}}/g, (averageVolume / 1_000_000).toFixed(2))
    .replace(/{{changePercent}}/g, Math.abs(changePercent).toFixed(2))
    .replace(/{{changeDirection}}/g, changeDirection)
    .replace(/{{priceColor}}/g, priceColor)
    .replace(/{{volumeSpike}}/g, volumeSpike)
    .replace(/{{alertMessage}}/g, `Unusual volume spike detected for ${symbol}`)
    .replace(/{{timestamp}}/g, timestamp)

  await transporter.sendMail({
    from: `"Signalist Alerts" <alesia.litvinenko@gmail.com>`,
    to: email,
    subject: `📊 Volume Alert: ${symbol} unusual trading activity`,
    html: htmlTemplate,
    text: `Volume Alert: ${symbol} is showing unusual trading volume of ${(currentVolume / 1_000_000).toFixed(2)}M shares.`,
  })
}

export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string
  date: string
  newsContent: string
}): Promise<void> => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace('{{date}}', date).replace(
    '{{newsContent}}',
    newsContent
  )

  const mailOptions = {
    from: `"Signalist News" <alesia.litvinenko@gmail.com>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist`,
    html: htmlTemplate,
  }

  await transporter.sendMail(mailOptions)
}
