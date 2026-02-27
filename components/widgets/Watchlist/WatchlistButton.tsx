'use client'

import { Star } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { useWatchlist } from '@/shared/providers/WatchlistProvider'

type WatchlistButtonProps = {
  symbol: string
  variant?: 'button' | 'icon'
  isActive?: boolean
}

const WatchlistButton = ({ symbol, variant = 'button', isActive }: WatchlistButtonProps) => {
  const [isAdding, setIsAdding] = React.useState(isActive)
  const { loading, addToWatchlist, removeFromWatchlist } = useWatchlist()

  const handleAddToWatchlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    if (isActive) {
      setIsAdding(false)

      removeFromWatchlist(symbol, symbol).catch((e) => {
        console.error(e)
        toast.error('Failed to remove from watchlist')
        setIsAdding(true)
      })
    } else {
      setIsAdding(true)

      addToWatchlist(symbol, symbol).catch((e) => {
        console.error(e)
        toast.error('Failed to add to watchlist')
        setIsAdding(false)
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
    <Button className="watchlist-btn mb-6" onClick={handleAddToWatchlist}>
      Add to Watchlist
    </Button>
  )
}

export default WatchlistButton
