'use client'

import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { getStockDetails, StockDetails } from '@/lib/actions/finnhub.actions'
import { useWatchlist } from '@/shared/providers/WatchlistProvider'

import { PriceAlert } from '../../PriceAlert'
import WatchlistButton from '../WatchlistButton/WatchlistButton'

const WatchlistTable = () => {
  const { watchlistSymbols, loading: watchlistLoading } = useWatchlist()
  const [stocks, setStocks] = React.useState<StockDetails[]>([])

  React.useEffect(() => {
    const fetchStockData = async () => {
      try {
        const stockList = await getStockDetails(watchlistSymbols)
        setStocks(stockList)
      } catch (error) {
        console.error('Failed to fetch watchlist stock data:', error)
      }
    }

    if (!watchlistLoading) {
      fetchStockData()
    }
  }, [watchlistSymbols, watchlistLoading])

  return (
    <div className="w-full overflow-x-auto pb-8">
      <table className="w-full text-left border-collapse watchlist-table">
        <thead>
          <tr className="table-header-row">
            <th className="p-4 w-12"></th>
            <th className="p-4 font-medium">Company</th>
            <th className="p-4 font-medium">Symbol</th>
            <th className="p-4 font-medium">Price</th>
            <th className="p-4 font-medium">Change</th>
            <th className="p-4 font-medium">Market Cap</th>
            <th className="p-4 font-medium">P/E Ratio</th>
            <th className="p-4 font-medium">Alert</th>
          </tr>
        </thead>
        <tbody className="text-gray-200">
          {watchlistLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="table-row ">
                <td className="p-4 border-r border-gray-600 skeleton"></td>
                <td className="table-cell skeleton "></td>
                <td className="table-cell skeleton "></td>
                <td className="table-cell skeleton "></td>
                <td className="table-cell skeleton "></td>
                <td className="table-cell skeleton "></td>
                <td className="table-cell skeleton "></td>
                <td className="table-cell skeleton "></td>
              </tr>
            ))
          ) : stocks.length === 0 ? (
            <tr className="table-row h-24">
              <td className="watchlist-empty-container" colSpan={8}>
                <p className="text-center text-gray-500">
                  No stocks in watchlist. Add some to see them here!
                </p>
              </td>
            </tr>
          ) : (
            stocks.map((stock) => (
              <tr key={stock.symbol} className="table-row">
                <td className="p-4 border-r border-gray-600">
                  <WatchlistButton symbol={stock.symbol} variant="icon" />
                </td>
                <td className="table-cell ">{stock.name}</td>
                <td className="table-cell ">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    className="hover:text-blue-400 hover:underline"
                  >
                    {stock.symbol}
                  </Link>
                </td>
                <td className="table-cell">${stock.price.toFixed(2)}</td>
                <td
                  className={`table-cell ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                >
                  {stock.change > 0 ? '+' : ''}
                  {stock.change.toFixed(2)}%
                </td>
                <td className="table-cell ">{formatLargeNumber(stock.marketCap)}</td>
                <td className="table-cell">{stock.peRatio?.toFixed(2) || '-'}</td>
                <td className="table-cell text-right">
                  <PriceAlert
                    alertData={{
                      alertName: stock.name,
                      symbol: stock.symbol,
                      threshold: stock.price,
                      company: stock.name,
                      alertType: 'price',
                    }}
                  >
                    <Button variant="outline" size="sm" className=" add-alert ">
                      Add Alert
                    </Button>
                  </PriceAlert>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function formatLargeNumber(num: number) {
  if (!num) return '-'
  if (num >= 1.0e12) return '$' + (num / 1.0e12).toFixed(2) + 'T'
  if (num >= 1.0e9) return '$' + (num / 1.0e9).toFixed(2) + 'B'
  if (num >= 1.0e6) return '$' + (num / 1.0e6).toFixed(2) + 'M'
  return '$' + num.toFixed(2)
}

export default WatchlistTable
