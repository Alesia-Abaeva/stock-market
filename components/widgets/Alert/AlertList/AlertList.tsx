'use client'

import { Edit2, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui'
import { TECHNICAL_ANALYSIS_WIDGET_CONFIG } from '@/shared/const/trading'
import { useAlertsContext } from '@/shared/providers/AlertProvider'
import { useUser } from '@/shared/providers/UserProvider'

import { TradingView } from '../../TradingView'
import { ConfirmModal } from '../ConfirmModal'
import { AlertForm } from '../Form'

const AlertList = () => {
  const { alerts, delete: deleteAlert } = useAlertsContext()

  const { user } = useUser()

  const handleDelete = async (id: string, email: string) => {
    deleteAlert(id, email)
  }

  return (
    <section>
      <div className={`alert-list ${alerts.length === 0 ? 'alert-empty' : ''}`}>
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

              <div className="flex flex-col items-end gap-1">
                <div className="alert-actions ">
                  <AlertForm
                    alertId={alert.alertId}
                    alertData={{ ...alert, threshold: alert.threshold }}
                    action="update"
                  >
                    <Button size="icon-sm" variant="ghost" className="alert-update-btn">
                      <Edit2 />
                    </Button>
                  </AlertForm>
                  <ConfirmModal
                    onConfirm={() => handleDelete(alert.alertId, user?.email ?? '')}
                    title="Are you sure you want to proceed?"
                    description="This will permanently delete this alert and it cannot be recovered. This action cannot be undone and will remove the alert from our system entirely."
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

        {alerts.length === 0 && (
          <div className="flex flex-col items-center gap-4 mt-10">
            <p className="text-gray-500">No alerts found. Create your first alert!</p>
            <AlertForm>
              <Button className="yellow-btn">Create Alert</Button>
            </AlertForm>
          </div>
        )}
      </div>
    </section>
  )
}

export default AlertList
