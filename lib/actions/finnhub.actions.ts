'use server'

import { cache } from 'react'

import { formatArticle, getDateRange, validateArticle } from '@/lib/utils'
import { POPULAR_STOCK_SYMBOLS } from '@/shared/const/trading'
import { MarketNewsArticle, RawNewsArticle } from '@/shared/types/global'

import { getWatchlistSymbolsByEmail } from './watchlist.actions'

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1'
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY ?? ''

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const options: RequestInit & { next?: { revalidate?: number } } = revalidateSeconds
    ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
    : { cache: 'no-store' }

  const res = await fetch(url, options)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Fetch failed ${res.status}: ${text}`)
  }
  return (await res.json()) as T
}

export { fetchJSON }

// Minimal types for search
interface FinnhubSearchResult {
  description: string
  displaySymbol: string
  symbol: string
  type: string
}

interface FinnhubSearchResponse {
  count: number
  result: FinnhubSearchResult[]
}

export interface StockWithWatchlistStatus {
  symbol: string
  name: string
  exchange: string
  type: string
  isInWatchlist: boolean
}

export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
  try {
    const range = getDateRange(5)
    const token = NEXT_PUBLIC_FINNHUB_API_KEY
    const cleanSymbols = (symbols || [])
      .map((s) => s?.trim().toUpperCase())
      .filter((s): s is string => Boolean(s))

    const maxArticles = 6

    // If we have symbols, try to fetch company news per symbol and round-robin select
    if (cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {}

      await Promise.all(
        cleanSymbols.map(async (sym) => {
          try {
            const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${range.from}&to=${range.to}&token=${token}`
            const articles = await fetchJSON<RawNewsArticle[]>(url, 300)
            perSymbolArticles[sym] = (articles || []).filter(validateArticle)
          } catch (e) {
            console.error('Error fetching company news for', sym, e)
            perSymbolArticles[sym] = []
          }
        })
      )

      const collected: MarketNewsArticle[] = []
      // Round-robin up to 6 picks
      for (let round = 0; round < maxArticles; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const sym = cleanSymbols[i]
          const list = perSymbolArticles[sym] || []
          if (list.length === 0) continue
          const article = list.shift()
          if (!article || !validateArticle(article)) continue
          collected.push(formatArticle(article, true, sym, round))
          if (collected.length >= maxArticles) break
        }
        if (collected.length >= maxArticles) break
      }

      if (collected.length > 0) {
        // Sort by datetime desc
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0))
        return collected.slice(0, maxArticles)
      }
      // If none collected, fall through to general news
    }

    // General market news fallback or when no symbols provided
    const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&token=${token}`
    const general = await fetchJSON<RawNewsArticle[]>(generalUrl, 300)

    const seen = new Set<string>()
    const unique: RawNewsArticle[] = []
    for (const art of general || []) {
      if (!validateArticle(art)) continue
      const key = `${art.id}-${art.url}-${art.headline}`
      if (seen.has(key)) continue
      seen.add(key)
      unique.push(art)
      if (unique.length >= 20) break // cap early before final slicing
    }

    const formatted = unique
      .slice(0, maxArticles)
      .map((a, idx) => formatArticle(a, false, undefined, idx))
    return formatted
  } catch (err) {
    console.error('getNews error:', err)
    throw new Error('Failed to fetch news')
  }
}

export const searchStocks = cache(
  async ({
    query,
    watchlistSymbols,
  }: {
    query?: string
    watchlistSymbols?: string[]
  }): Promise<StockWithWatchlistStatus[]> => {
    try {
      const token = NEXT_PUBLIC_FINNHUB_API_KEY
      const results: StockWithWatchlistStatus[] = []
      let userWatchlistSymbols: Set<string> = new Set()

      if (watchlistSymbols) {
        userWatchlistSymbols = new Set(watchlistSymbols)
      }

      console.log('User watchlist symbols:', userWatchlistSymbols)

      if (!query) {
        // 1. No query -> fetch top popular symbols
        // We'll limit to first 10 for performance
        const topSymbols = POPULAR_STOCK_SYMBOLS.slice(0, 10)

        await Promise.all(
          topSymbols.map(async (sym) => {
            try {
              // Setup caching for 1 hour (3600s)
              const url = `${FINNHUB_BASE_URL}/stock/profile2?symbol=${sym}&token=${token}`
              // We reuse fetchJSON but need to type the return.
              // Profile2 returns { country, currency, exchange, name, ticker, ... }
              const profile = await fetchJSON<{
                name: string
                ticker: string
                exchange: string
                finnhubIndustry: string
              }>(url, 3600)

              if (profile && profile.ticker) {
                const tickerUpper = profile.ticker.toUpperCase()
                results.push({
                  symbol: tickerUpper,
                  name: profile.name || profile.ticker,
                  exchange: profile.exchange || 'US',
                  type: 'Common Stock', // Default for profile2
                  isInWatchlist: userWatchlistSymbols.has(tickerUpper),
                })
              }
            } catch (e) {
              // Ignore individual failures
              console.error(`Failed to fetch profile for ${sym}`, e)
            }
          })
        )
      } else {
        // 2. Query provided -> use search endpoint
        const trimmedQuery = query.trim()
        if (!trimmedQuery) return []

        const url = `${FINNHUB_BASE_URL}/search?q=${encodeURIComponent(trimmedQuery)}&token=${token}`
        const searchRes = await fetchJSON<FinnhubSearchResponse>(url, 1800) // 30 mins cache

        if (searchRes && searchRes.result) {
          searchRes.result.forEach((item) => {
            // Filter out garbage if needed, otherwise map
            if (!item.symbol) return
            const tickerUpper = item.symbol.toUpperCase()
            results.push({
              symbol: tickerUpper,
              name: item.description || item.symbol,
              exchange: item.displaySymbol?.split(':')[0] || 'US', // e.g. "NASDAQ:AAPL" -> NASDAQ
              type: item.type || 'Stock',
              isInWatchlist: userWatchlistSymbols.has(tickerUpper),
            })
          })
        }
      }

      // Limit to 15 items
      return results.slice(0, 15)
    } catch (error) {
      console.error('Error in stock search:', error)
      return []
    }
  }
)
