'use client'

import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { getSessionAction } from '@/lib/actions/auth.actions'
import { addToWatchList } from '@/lib/actions/watchlist.actions'
import { User } from '@/shared/types/global'

const WatchlistButton = ({ symbol }: { symbol: string }) => {
  const [user, setUser] = React.useState<User | null>(null)
  const [loadingUser, setLoadingUser] = React.useState<boolean>(true)

  React.useEffect(() => {
    getSessionAction().then((session) => {
      if (session?.user) {
        setUser(session.user)
      }
      setLoadingUser(false)
    })
  }, [])

  const handleAddToWatchlist = async () => {
    if (!user) {
      toast.error('Please sign in to add to watchlist')
      return
    }
    try {
      const result = await addToWatchList(user.email, symbol, symbol)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to add to watchlist')
    }
  }

  return (
    <Button className="watchlist-btn mb-6" onClick={handleAddToWatchlist} disabled={loadingUser}>
      Add to Watchlist
    </Button>
  )
}

export default WatchlistButton
