'use client'
import { ArrowRight } from 'lucide-react'
import React from 'react'

import { getNews } from '@/lib/actions/finnhub.actions'
import { formatTimeAgo } from '@/lib/utils'
import { useWatchlist } from '@/shared/providers/WatchlistProvider'
import { MarketNewsArticle } from '@/shared/types/global'

export type WatchlistNewsProps = {
  news?: MarketNewsArticle[]
}

const WatchlistNews = () => {
  const { watchlistSymbols, loading: watchlistLoading } = useWatchlist()
  const [news, setNews] = React.useState<MarketNewsArticle[]>([])

  React.useEffect(() => {
    const fetchStockData = async () => {
      try {
        const stockList = await getNews(watchlistSymbols)
        setNews(stockList)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      }
    }

    if (!watchlistLoading && watchlistSymbols.length > 0) {
      fetchStockData()
    }
  }, [watchlistSymbols, watchlistLoading])

  return (
    <div className="w-full">
      <h3 className="font-semibold text-2xl text-gray-100 mb-5">News</h3>

      <div className="watchlist-news">
        {news?.map(({ datetime, headline, id, related, source, summary, url }) => (
          <div key={id} className="news-item">
            <span className="news-tag">{related}</span>

            <p className="news-title">{headline}</p>
            <div className="news-meta">
              {source} • {formatTimeAgo(datetime)}
            </div>

            <div className="news-summary">{summary}</div>

            <a
              href={url}
              className="news-cta py-0 px-0 flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read more <ArrowRight className="w-4 h-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WatchlistNews
