'use client'

import { Edit2, Trash2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui'
import type { AlertItem } from '@/database/models/alert.model'
import { getAlertListByEmail, removeAlert } from '@/lib/actions/alert.actions'
import { TECHNICAL_ANALYSIS_WIDGET_CONFIG } from '@/shared/const/trading'
import { useUser } from '@/shared/providers/UserProvider'

import { TradingView } from '../../TradingView'
import { ConfirmModal } from '../ConfirmModal'

const AlertList = () => {
  const [alerts, setAlerts] = React.useState<AlertItem[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)

  const { user } = useUser()

  React.useEffect(() => {
    const fetchStockData = async () => {
      try {
        const stockList = await getAlertListByEmail(user?.email)
        setAlerts(stockList)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      }
    }

    fetchStockData()
  }, [user?.email])

  const handleDelete = async (id: string, email: string) => {
    if (!id || !email) {
      toast.error('Something went wrong')
      return
    }

    console.log('Deleting alert with id:', id, 'for email:', email)

    setLoading(true)
    try {
      const responce = await removeAlert(email, id)

      if (responce.success) {
        toast.success(responce.message || 'Alert deleted successfully')
      } else {
        toast.error(responce.message || 'Failed to delete alert')
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error?.message || 'Failed to delete alert'
          : 'Failed to delete alert'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div className="alert-list">
        {alerts.map((alert) => (
          <div key={alert.alertId} className="alert-item relative">
            <div className=" absolute left-0 right-1">
              <TradingView
                scriptUrl={`https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js`}
                config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(alert.symbol)}
                className="tradingview-widget-container-transparent"
              />
            </div>
            <div className="h-28 alert-details" />
            <div className="flex justify-between items-center ">
              <div>
                <p>
                  Alert: <span className="alert-name ">{alert.alertName}</span>
                </p>
                <p className="alert-price ">
                  {alert.alertType} {alert.condition} ${alert.threshold}
                </p>
              </div>

              <div className="flex flex-col items-end">
                <div className="alert-actions ">
                  <Button size="icon-sm" variant="ghost" className="alert-update-btn">
                    <Edit2 />
                  </Button>
                  <ConfirmModal
                    onConfirm={() => handleDelete(alert.alertId, user?.email ?? '')}
                    title="Are you absolutely sure?"
                    description="This action cannot be undone. This will permanently delete your account from our
            servers."
                  >
                    <Button size="icon-sm" variant="ghost" className="alert-delete-btn">
                      <Trash2 />
                    </Button>
                  </ConfirmModal>
                </div>
                <span className="text-yellow-400 text-xs bg-yellow-400/20 px-1 py-0.5 border rounded-sm">
                  {alert.frequency}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AlertList
