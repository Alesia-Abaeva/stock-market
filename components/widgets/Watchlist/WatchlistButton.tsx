'use client'

import React from 'react'

import { Button } from '@/components/ui/button'

const WatchlistButton = ({ symbol }: { symbol: string }) => {
  return (
    <Button className="watchlist-btn mb-6" onClick={() => console.log('Add to watchlist', symbol)}>
      Add to Watchlist
    </Button>
  )
}

export default WatchlistButton
