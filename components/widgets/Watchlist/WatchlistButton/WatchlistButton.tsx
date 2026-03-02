'use client'

import { Star, Trash2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useWatchlist } from '@/shared/providers/WatchlistProvider'

type WatchlistButtonProps = {
  symbol: string
  variant?: 'button' | 'icon'
}

const WatchlistButton = ({ symbol, variant = 'button' }: WatchlistButtonProps) => {
  const { loading, addToWatchlist, removeFromWatchlist, watchlistSymbols } = useWatchlist()

  const isAdding = watchlistSymbols.includes(symbol)

  const handleAddToWatchlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    if (isAdding) {
      removeFromWatchlist(symbol, symbol).catch((e) => {
        console.error(e)
        toast.error('Failed to remove from watchlist')
      })
    } else {
      // setIsAdding(true)

      addToWatchlist(symbol, symbol).catch((e) => {
        console.error(e)
        toast.error('Failed to add to watchlist')
        // setIsAdding(false)
      })
    }
  }

  if (variant === 'icon') {
    return (
      <Button variant="ghost" size="icon" onClick={handleAddToWatchlist}>
        <Star
          fill={isAdding ? 'yellow' : ''}
          className={isAdding ? 'text-yellow-100' : 'text-gray-500'}
        />
      </Button>
    )
  }

  return (
    <Button
      className={`${isAdding ? 'watchlist-remove' : ''} mb-6 watchlist-btn`}
      onClick={handleAddToWatchlist}
    >
      {isAdding && <Trash2 />}
      {isAdding ? 'Remove from Watchlist' : 'Add to Watchlist'}
    </Button>
  )
}

export default WatchlistButton
