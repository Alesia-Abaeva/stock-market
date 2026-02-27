/* eslint-disable no-unused-vars */
'use client'

import React from 'react'
import { toast } from 'sonner'

import {
  addToWatchList as addToWatchListAction,
  getWatchlistSymbolsByEmail,
  removeFromWatchList as removeFromWatchListAction,
} from '@/lib/actions/watchlist.actions'

import { useUser } from './UserProvider'

type WatchlistContextType = {
  watchlistSymbols: string[]
  loading: boolean
  addToWatchlist: (symbol: string, company: string) => Promise<void>
  removeFromWatchlist: (symbol: string, company: string) => Promise<void>
  isInWatchlist: (symbol: string) => boolean
}

const WatchlistContext = React.createContext<WatchlistContextType>({
  watchlistSymbols: [],
  loading: false,
  addToWatchlist: async () => {},
  removeFromWatchlist: async () => {},
  isInWatchlist: () => false,
})

export const WatchlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: userLoading } = useUser()
  const [watchlistSymbols, setWatchlistSymbols] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)

  // Fetch watchlist when user loads
  React.useEffect(() => {
    const fetchWatchlist = async () => {
      if (!user?.email) {
        setWatchlistSymbols([])
        return
      }

      setLoading(true)
      try {
        const symbols = await getWatchlistSymbolsByEmail(user.email)
        setWatchlistSymbols(symbols)
      } catch (error) {
        console.error('Failed to fetch watchlist:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!userLoading) {
      fetchWatchlist()
    }
  }, [user, userLoading])

  const addToWatchlist = async (symbol: string, company: string) => {
    if (!user?.email) {
      toast.error('Please sign in to modify watchlist')
      return
    }

    // Optimistic update
    const upperSymbol = symbol.toUpperCase()
    setWatchlistSymbols((prev) => [...prev, upperSymbol])

    try {
      const result = await addToWatchListAction(user.email, upperSymbol, company)
      if (result.success) {
        toast.success(result.message)
      } else {
        // Revert on failure
        setWatchlistSymbols((prev) => prev.filter((s) => s !== upperSymbol))
        toast.error(result.message)
      }
    } catch (error) {
      // Revert on error
      setWatchlistSymbols((prev) => prev.filter((s) => s !== upperSymbol))
      console.error(error)
      toast.error('Failed to add to watchlist')
    }
  }

  const removeFromWatchlist = async (symbol: string, company: string) => {
    if (!user?.email) return

    // Optimistic update
    const upperSymbol = symbol.toUpperCase()
    setWatchlistSymbols((prev) => prev.filter((s) => s !== upperSymbol))

    try {
      const result = await removeFromWatchListAction(user.email, upperSymbol, company)
      if (result.success) {
        toast.success(result.message)
      } else {
        // Revert on failure
        setWatchlistSymbols((prev) => [...prev, upperSymbol])
        toast.error(result.message)
      }
    } catch (error) {
      // Revert on error
      setWatchlistSymbols((prev) => [...prev, upperSymbol])
      console.error(error)
      toast.error('Failed to remove from watchlist')
    }
  }

  const isInWatchlist = (symbol: string) => {
    return watchlistSymbols.includes(symbol.toUpperCase())
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlistSymbols,
        loading,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

export const useWatchlist = () => React.useContext(WatchlistContext)
