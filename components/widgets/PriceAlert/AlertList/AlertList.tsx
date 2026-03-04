'use client'

import { Edit2, Trash2 } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui'
import type { AlertItem } from '@/database/models/alert.model'
import { getAlertListByEmail } from '@/lib/actions/alert.actions'
import { TECHNICAL_ANALYSIS_WIDGET_CONFIG } from '@/shared/const/trading'
import { useUser } from '@/shared/providers/UserProvider'

import { TradingView } from '../../TradingView'

const AlertList = () => {
  const [alerts, setAlerts] = React.useState<AlertItem[]>([])

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

  console.log('alerts', alerts)

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
                  <Button size="icon-sm" variant="ghost" className="alert-delete-btn">
                    <Trash2 />
                  </Button>
                  <Button size="icon-sm" variant="ghost" className="alert-update-btn">
                    <Edit2 />
                  </Button>
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
