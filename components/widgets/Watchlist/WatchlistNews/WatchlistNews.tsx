'use client'

import { ArrowRight } from 'lucide-react'

import { MarketNewsArticle } from '@/shared/types/global'

export type WatchlistNewsProps = {
  news?: MarketNewsArticle[]
}

const WatchlistNews = ({ news }: WatchlistNewsProps) => {
  return (
    <div className="w-full">
      <h3 className="font-semibold text-2xl text-gray-100 mb-5">News</h3>

      <div className="watchlist-news">
        {news?.map(({ datetime, headline, id, related, source, summary, url }) => (
          <div key={id} className="news-item">
            <span className="news-tag">{related}</span>

            <p className="news-title">{headline}</p>
            <div className="news-meta">
              {source} • {datetime}
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
