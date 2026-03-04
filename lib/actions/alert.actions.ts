'use server'

import { randomUUID } from 'crypto'

import { AlertListModelDB } from '@/database/models/alert.model'
import { connectToDataBase } from '@/database/mongoose'
import type { Alert } from '@/shared/types/global'

type AlertRequest = Alert & { email?: string }

export async function getAlertListByEmail(email?: string): Promise<string[]> {
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

    const items = await AlertListModelDB.find({ userId }, { symbol: 1 }).lean()
    return items.map((i) => String(i.symbol))
  } catch (err) {
    console.error('getAlertListByEmail error:', err)
    return []
  }
}

export async function addAlert({
  alertName,
  email,
  symbol,
  company,
  threshold,
  alertType,
  condition,
  frequency,
  id,
}: AlertRequest): Promise<{ success: boolean; message: string }> {
  if (!email || !symbol || !company || !alertName || !threshold) {
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

    // Проверка на дубликат (если такой алерт с таким же порогом уже есть)
    const existing = await AlertListModelDB.findOne({
      userId,
      symbol: symbol.toUpperCase(),
      alertType,
      threshold,
    })

    if (existing) {
      return { success: false, message: 'Duplicate alert exists' }
    }

    // Генерируем ID если не передан
    const newAlertId = id || randomUUID()

    await AlertListModelDB.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
      alertName,
      alertType,
      threshold,
      condition,
      frequency,
      alertId: newAlertId,
    })

    return { success: true, message: 'Added to alerts' }
  } catch (err) {
    console.error('addToAlerts error:', err)
    return { success: false, message: 'Failed to add to alerts' }
  }
}

export async function removeAlert(
  email: string,
  id: string
): Promise<{ success: boolean; message: string }> {
  if (!email || !id) {
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

    // Check if alert exists
    const existing = await AlertListModelDB.findOne({ userId, alertId: id })

    if (!existing) {
      return { success: false, message: 'Alert not found' }
    }

    await AlertListModelDB.deleteOne({ userId, alertId: id })
    return { success: true, message: 'Removed from alerts' }
  } catch (err) {
    console.error('removeFromAlerts error:', err)
    return { success: false, message: 'Failed to remove from alerts' }
  }
}
