import { type Document, type Model, model, models, Schema } from 'mongoose'

import type { Alert, AlertType, Condition, Frequency } from '@/shared/types/global'

export type AlertRequest = Alert & { email?: string }

export type AlertAction = 'update' | 'create'

// Plain type for client-side state (no Mongoose Document methods)
export type AlertItem = {
  _id?: string
  userId: string
  symbol: string
  company: string
  addedAt: Date | string
  alertName: string
  alertType: AlertType
  threshold: number
  condition: Condition
  frequency: Frequency
  alertId: string
  lastTriggeredAt?: Date | string | null
  isTriggered?: boolean
}

// Mongoose Document type for DB layer only
export interface AlertItemDocument extends Document {
  userId: string
  symbol: string
  company: string
  addedAt: Date
  alertName: string
  alertType: AlertType
  threshold: number
  condition: Condition
  frequency: Frequency
  alertId: string
  lastTriggeredAt?: Date | null
  isTriggered?: boolean
}

const AlertSchema = new Schema<AlertItemDocument>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
    alertName: { type: String, required: true, trim: true },
    alertType: { type: String, required: true, enum: ['upper', 'lower', 'price'] },
    threshold: { type: Number, required: true },
    condition: { type: String, required: true, enum: ['greater', 'less', 'equal'] },
    frequency: { type: String, required: true, enum: ['once', 'daily', 'weekly', 'hourly'] },
    alertId: { type: String, required: true, unique: true },
    lastTriggeredAt: { type: Date, default: null },
    isTriggered: { type: Boolean, default: false },
  },
  { timestamps: false }
)

// Prevent duplicate symbols per user
AlertSchema.index({ userId: 1, symbol: 1 }, { unique: true })

export const AlertListModelDB: Model<AlertItemDocument> =
  (models?.Alert as Model<AlertItemDocument>) || model<AlertItemDocument>('Alert', AlertSchema)
