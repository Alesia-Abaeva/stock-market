'use server'

import { Watchlist } from '@/database/models/watchlist.model'
import { connectToDataBase } from '@/database/mongoose'

export async function getWatchlistSymbolsByEmail(email?: string): Promise<string[]> {
  if (!email) return []

  try {
    const mongoose = await connectToDataBase()
    const db = mongoose?.connection.db
    if (!db) throw new Error('MongoDB connection not found')

    // Better Auth stores users in the "user" collection
    const user = await db
      .collection('user')
      .findOne<{ _id?: unknown; id?: string; email?: string }>({ email })

    if (!user) return []

    const userId = (user.id as string) || String(user._id || '')
    if (!userId) return []

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean()
    return items.map((i) => String(i.symbol))
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err)
    return []
  }
}

export async function addToWatchList(
  email: string,
  symbol: string,
  company: string
): Promise<{ success: boolean; message: string }> {
  if (!email || !symbol || !company) {
    return { success: false, message: 'Missing require fields' }
  }

  try {
    const mongoose = await connectToDataBase()
    const db = mongoose?.connection.db

    if (!db) throw new Error('MongoDB connection not found')

    const user = await db.collection('user').findOne<{ id?: string; _id?: unknown }>({ email })

    if (!user) return { success: false, message: 'User not found' }

    const userId = (user.id as string) || String(user._id || '')

    if (!userId) {
      return { success: false, message: 'User ID not found' }
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() })
    if (existing) {
      return { success: false, message: 'Stock already in watchlist' }
    }

    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
    })

    return { success: true, message: 'Added to watchlist' }
  } catch (err) {
    console.error('addToWatchList error:', err)
    return { success: false, message: 'Failed to add to watchlist' }
  }
}

export async function removeFromWatchList(
  email: string,
  symbol: string,
  company: string
): Promise<{ success: boolean; message: string }> {
  if (!email || !symbol || !company) {
    return { success: false, message: 'Missing require fields' }
  }

  try {
    const mongoose = await connectToDataBase()
    const db = mongoose?.connection.db

    if (!db) throw new Error('MongoDB connection not found')

    const user = await db.collection('user').findOne<{ id?: string; _id?: unknown }>({ email })

    if (!user) return { success: false, message: 'User not found' }

    const userId = (user.id as string) || String(user._id || '')

    if (!userId) {
      return { success: false, message: 'User ID not found' }
    }

    // Check if already in watchlist
    const existing = await Watchlist.findOne({ userId, symbol: symbol.toUpperCase() })

    if (!existing) {
      return { success: false, message: 'Stock not in watchlist' }
    }

    await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() })

    return { success: true, message: 'Removed from watchlist' }
  } catch (err) {
    console.error('removeFromWatchList error:', err)
    return { success: false, message: 'Failed to remove from watchlist' }
  }
}
