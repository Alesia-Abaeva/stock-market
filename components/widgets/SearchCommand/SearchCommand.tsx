'use client'

import { Loader2, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui'
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from '@/components/ui/command'
import { searchStocks } from '@/lib/actions/finnhub.actions'
import { useDebounce } from '@/shared/hooks/use-debouns'
import { StockWithWatchlistStatus } from '@/shared/types/global'

import { WatchlistButton } from '../Watchlist'

export type SearchCommandProps = {
  renderAs?: 'button' | 'text'
  label?: string
  initialStocks: StockWithWatchlistStatus[]
  watchlistSymbols: string[]
}

const NUMBER_OF_STOCKS_TO_SHOW = 10

export function SearchCommand({
  renderAs = 'button',
  label = 'Add stock',
  initialStocks,
  watchlistSymbols,
}: SearchCommandProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [stock, setStock] = React.useState<StockWithWatchlistStatus[]>(initialStocks)

  const isSearchMode = !!searchTerm.trim()

  const displayStocks = isSearchMode ? stock : stock?.slice(0, NUMBER_OF_STOCKS_TO_SHOW)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleSelectStock = (stock: string) => {
    console.log(`Selected stock: ${stock}`)
    setOpen(false)
    setSearchTerm('')

    setStock(initialStocks)
  }

  const handleSearch = async () => {
    if (!isSearchMode) return setStock(initialStocks)

    setLoading(true)

    try {
      const res = await searchStocks({ query: searchTerm.trim(), watchlistSymbols })

      setStock(res)
    } catch (e) {
      console.error('Error searching stocks:', e)
      setStock([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300)

  React.useEffect(() => {
    debouncedSearch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  return (
    <>
      {renderAs === 'button' ? (
        <Button className="search-btn" onClick={() => setOpen(true)}>
          {label}
        </Button>
      ) : (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="search-field">
          <CommandInput
            placeholder="Search stocks..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list">
          {loading ? (
            <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              <CommandEmpty className="search-list-empty">
                {isSearchMode ? 'Start typing to search stocks...' : 'No stocks found.'}
              </CommandEmpty>
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? 'Search results: ' : 'Top stocks: '}
                {displayStocks?.length || NUMBER_OF_STOCKS_TO_SHOW}
              </div>
              {displayStocks?.map((stock) => (
                <li key={stock.symbol} className="search-item">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={() => handleSelectStock(stock.symbol)}
                    className="search-item-link"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">{stock.name}</div>

                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                    <WatchlistButton
                      symbol={stock.symbol}
                      variant="icon"
                      isActive={stock.isInWatchlist}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
