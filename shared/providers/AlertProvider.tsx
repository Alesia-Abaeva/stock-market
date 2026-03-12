/* eslint-disable no-unused-vars */
'use client'

import React from 'react'
import { toast } from 'sonner'

import type { AlertAction, AlertItem, AlertRequest } from '@/database/models/alert.model'
import {
  addAlert,
  getAlertListByEmail,
  removeAlert,
  updateAlert,
} from '@/lib/actions/alert.actions'

import { useUser } from './UserProvider'

type AlertContextType = {
  alerts: AlertItem[]
  loading: boolean
  add: (
    data: AlertRequest,
    action: AlertAction,
    closeRef?: React.RefObject<HTMLButtonElement | null>
  ) => void
  delete: (id: string, email: string) => void
}

const AlertContext = React.createContext<AlertContextType>({
  alerts: [],
  loading: false,
  add: async () => {},
  delete: async () => {},
})

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: userLoading } = useUser()
  const [alerts, setAlerts] = React.useState<AlertItem[]>([])
  const [loading, setLoading] = React.useState(false)

  // Fetch alerts when user loads
  React.useEffect(() => {
    const fetchAlertList = async () => {
      if (!user?.email) {
        setAlerts([])
        return
      }

      setLoading(true)
      try {
        const alertList = await getAlertListByEmail(user?.email)
        setAlerts(alertList)
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      } finally {
        setLoading(false)
      }
    }

    if (!userLoading) {
      fetchAlertList()
    }
  }, [user, userLoading])

  const add = async (
    data: AlertRequest,
    action: AlertAction,
    closeRef?: React.RefObject<HTMLButtonElement | null>
  ) => {
    try {
      const result = action === 'create' ? await addAlert(data) : await updateAlert(data)

      if (result.success) {
        console.log(`${action === 'create' ? 'Add' : 'Update'} alert successful:`, result)
        toast.success(`${action === 'create' ? 'Alert added' : 'Alert updated'} successfully!`)
        closeRef?.current?.click()

        setAlerts((prev) => {
          if (action === 'create') {
            const newAlert: AlertItem = {
              userId: user?.id || '',
              symbol: data.symbol.toUpperCase(),
              company: data.company,
              addedAt: new Date(),
              alertName: data.alertName,
              alertType: data.alertType,
              threshold: data.threshold,
              condition: data.condition || 'greater',
              frequency: data.frequency || 'daily',
              alertId: data.id,
            }

            return [...prev, newAlert]
          } else {
            return prev.map((alert) => (alert.alertId === data.id ? { ...alert, ...data } : alert))
          }
        })
      } else {
        toast.error(
          result.message ||
            `An error occurred while ${action === 'create' ? 'adding' : 'updating'} the alert. Please try again later.`
        )
      }
    } catch (e) {
      console.error(e)
      toast.error('An error occurred while processing the alert. Please try again later.', {
        description: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  }

  const deleteAlert = async (id: string, email: string) => {
    if (!id || !email) {
      toast.error('Something went wrong')
      return
    }

    setLoading(true)
    try {
      const responce = await removeAlert(email, id)

      if (responce.success) {
        toast.success(responce.message || 'Alert deleted successfully')

        // Refresh the alert list after deletion
        const updatedAlerts = alerts.filter((alert) => alert.alertId !== id)
        setAlerts(updatedAlerts)
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
    <AlertContext.Provider
      value={{
        alerts,
        loading,
        add,
        delete: deleteAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  )
}

export const useAlertsContext = () => React.useContext(AlertContext)
