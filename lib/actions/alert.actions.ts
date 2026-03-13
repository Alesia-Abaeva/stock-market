'use server'

import { randomUUID } from 'crypto'

import { type AlertItem, AlertListModelDB, type AlertRequest } from '@/database/models/alert.model'
import { connectToDataBase } from '@/database/mongoose'
import type { AlertUpdate } from '@/shared/types/global'

export async function getAlertListByEmail(email?: string): Promise<AlertItem[]> {
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

    const items = await AlertListModelDB.find({ userId }).lean()
    return JSON.parse(JSON.stringify(items))
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

    console.log('removeAlert user lookup:', { email, user })

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

export async function updateAlert({
  alertName,
  threshold,
  condition,
  frequency,
  id,
  email,
}: AlertUpdate): Promise<{ success: boolean; message: string }> {
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

    const updatePayload = {
      alertName,
      threshold,
      condition,
      frequency,
    }

    // Удаляем undefined поля, чтобы не затереть существующие данные пустотой (если partial update)
    Object.keys(updatePayload).forEach(
      (key) => (updatePayload as any)[key] === undefined && delete (updatePayload as any)[key]
    )

    await AlertListModelDB.updateOne({ userId, alertId: id }, { $set: updatePayload })
    return { success: true, message: 'Alert updated' }
  } catch (err) {
    console.error('changeAlert error:', err)
    return { success: false, message: 'Failed to update alert' }
  }
}

// Returns alerts eligible to fire based on their frequency cooldown
export async function getAllAlertsForMonitoring(): Promise<Array<AlertItem & { email: string }>> {
  try {
    const mongoose = await connectToDataBase()
    const db = mongoose?.connection.db
    if (!db) throw new Error('MongoDB connection not found')

    const now = new Date()

    // Cooldown thresholds per frequency
    const cooldownMs: Record<string, number> = {
      once: Infinity, // always eligible (deleted after trigger)
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
    }

    const alerts = await AlertListModelDB.find({}).lean()

    // Filter by cooldown
    const eligible = alerts.filter((alert) => {
      if (!alert.lastTriggeredAt) return true // never triggered — always eligible
      const elapsed = now.getTime() - new Date(alert.lastTriggeredAt).getTime()
      return elapsed >= (cooldownMs[alert.frequency] ?? Infinity)
    })

    // Enrich with user email
    // Better Auth stores users with both `id` (string) and `_id` (ObjectId).
    // The alert's userId was saved as `user.id || String(user._id)`, so we
    // try matching on `id` first, then fall back to `_id` string comparison.
    const { ObjectId } = await import('mongodb')

    const enriched = await Promise.all(
      eligible.map(async (alert) => {
        try {
          let user = await db.collection('user').findOne<{ email: string }>({ id: alert.userId })

          if (!user) {
            // Try matching by _id (ObjectId or string)
            const maybeObjectId = ObjectId.isValid(alert.userId) ? new ObjectId(alert.userId) : null
            if (maybeObjectId) {
              user = await db.collection('user').findOne<{ email: string }>({ _id: maybeObjectId })
            }
          }

          return { ...alert, email: user?.email || '' }
        } catch {
          return { ...alert, email: '' }
        }
      })
    )

    return JSON.parse(JSON.stringify(enriched.filter((a) => a.email)))
  } catch (err) {
    console.error('getAllAlertsForMonitoring error:', err)
    return []
  }
}

export async function updateAlertLastTriggered(alertId: string): Promise<void> {
  try {
    await connectToDataBase()
    await AlertListModelDB.updateOne(
      { alertId },
      { $set: { lastTriggeredAt: new Date(), isTriggered: true } }
    )
  } catch (err) {
    console.error('updateAlertLastTriggered error:', err)
  }
}
