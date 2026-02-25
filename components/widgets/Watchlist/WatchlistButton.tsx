'use client'

import { Star } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { addToWatchList } from '@/lib/actions/watchlist.actions'
import { useUser } from '@/shared/providers/UserProvider'

type WatchlistButtonProps = {
  symbol: string
  variant?: 'button' | 'icon'
  isActive?: boolean
}

const WatchlistButton = ({ symbol, variant = 'button', isActive }: WatchlistButtonProps) => {
  const { user, loading } = useUser()
  const [isAdding, setIsAdding] = React.useState(isActive)

  const handleAddToWatchlist = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading) return

    if (!user?.email) {
      toast.error('Please sign in to add to watchlist')
      return
    }

    setIsAdding(true)
    try {
      const result = await addToWatchList(user.email, symbol, symbol)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
        setIsAdding(false)
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to add to watchlist')
      setIsAdding(false)
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
