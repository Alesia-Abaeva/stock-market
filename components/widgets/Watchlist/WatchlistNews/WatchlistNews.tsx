'use client'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { MarketNewsArticle } from '@/shared/types/global'

export type WatchlistNewsProps = {
  news?: MarketNewsArticle[]
}

const WatchlistNews = ({ news }: WatchlistNewsProps) => {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(
      'wss://ws.finnhub.io?token=d6c33d1r01qp4li1c3egd6c33d1r01qp4li1c3f0'
    )
    socketRef.current = socket

    // Connection opened -> Subscribe
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'subscribe', symbol: 'AAPL' }))
      socket.send(JSON.stringify({ type: 'subscribe', symbol: 'BINANCE:BTCUSDT' }))
      socket.send(JSON.stringify({ type: 'subscribe', symbol: 'IC MARKETS:1' }))
    })

    // Listen for messages
    socket.addEventListener('message', (event) => {
      console.log('Message from server ', event.data)
    })

    // Cleanup on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'unsubscribe', symbol: 'AAPL' }))
        socket.send(JSON.stringify({ type: 'unsubscribe', symbol: 'BINANCE:BTCUSDT' }))
        socket.send(JSON.stringify({ type: 'unsubscribe', symbol: 'IC MARKETS:1' }))
        socket.close()
      }
    }
  }, []) // Empty dependency array means this runs once on mount

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
