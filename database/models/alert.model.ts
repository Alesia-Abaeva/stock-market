import { type Document, type Model, model, models, Schema } from 'mongoose'

import type { AlertType, Condition, Frequency } from '@/shared/types/global'

export interface AlertItem extends Document {
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
}

const AlertSchema = new Schema<AlertItem>(
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
  },
  { timestamps: false }
)

// Prevent duplicate symbols per user
AlertSchema.index({ userId: 1, symbol: 1 }, { unique: true })

export const AlertListModelDB: Model<AlertItem> =
  (models?.Alert as Model<AlertItem>) || model<AlertItem>('Alert', AlertSchema)
