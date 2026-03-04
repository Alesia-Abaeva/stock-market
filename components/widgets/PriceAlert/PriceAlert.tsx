'use client'

import React, { use } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { addAlert } from '@/lib/actions/alert.actions'
import { ALERT_TYPE_OPTIONS, CONDITION_OPTIONS, FREQUENCY_OPTIONS } from '@/shared/const/optionts'
import { useUser } from '@/shared/providers/UserProvider'
import type { Alert, AlertData } from '@/shared/types/global'

import { InputField, SelectField } from '../Forms'
import { InputWithIcon } from '../Forms/InputWithIcon'

type AlertModalProps = {
  alertId?: string
  alertData?: AlertData
  action?: string
}

type PriceAlertProps = React.PropsWithChildren<AlertModalProps>

const PriceAlert = ({ action, alertData, alertId, children }: PriceAlertProps) => {
  const defaultValues: Alert = {
    symbol: alertData?.symbol || '',
    company: alertData?.company || '',
    alertName: '',
    alertType: 'price',
    threshold: alertData?.threshold || 0,
    id: alertId || '',
    currentPrice: alertData?.threshold || 0,
    condition: 'greater',
    frequency: 'daily',
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
  } = useForm<Alert>({ defaultValues, mode: 'onBlur' })

  const { user } = useUser()

  const onSubmit = async (data: Alert) => {
    const { alertName, symbol, company, threshold, alertType, condition, frequency, id } = data

    console.log('Add alert result:')

    try {
      const request = {
        email: user?.email,
        alertName,
        symbol,
        company,
        threshold,
        alertType,
        condition,
        frequency,
        id: id || `alert-${Date.now()}`,
      }
      const result = await addAlert(request)

      console.log('Add alert result:', result)

      if (result.success) {
        console.log('Add alert successful:', result)
        toast.success('Alert added successfully!')
      } else {
        toast.error(
          result.message || 'An error occurred while adding the alert. Please try again later.'
        )
      }
    } catch (e) {
      console.error(e)
      toast.error('An error occurred during sign-up. Please try again later.', {
        description: e instanceof Error ? e.message : 'Unknown error',
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button variant="outline">Open Dialog</Button> */}
        {children}
      </DialogTrigger>
      <DialogContent className="alert-dialog ">
        <DialogHeader className="pb-2">
          <DialogTitle className="alert-title ">Price Alert</DialogTitle>
          <DialogDescription
          // className="alert-empty"
          >
            {/* No active alerts. Add one from the watchlist. */}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-3">
            <InputField
              label="Alert Name"
              name="alertName"
              register={register}
              error={errors.alertName}
              placeholder={`E.g. Buy ${alertData?.company || ''} if it drops below $${alertData?.threshold || ''}`}
              validation={{
                required: 'Alert Name is required',
                minLength: { value: 2, message: 'Alert Name must be at least 2 characters' },
              }}
            />
            <InputField
              label="Stock identifier"
              name="company"
              placeholder=""
              register={register}
              error={errors.company}
              disabled
            />
            <SelectField
              name="alertType"
              label="Alert Type"
              placeholder="Select an alert type"
              error={errors.alertType}
              options={ALERT_TYPE_OPTIONS}
              control={control}
              disabled
            />
            <SelectField
              name="condition"
              label="Condition"
              placeholder="Select a condition"
              error={errors.condition}
              options={CONDITION_OPTIONS}
              control={control}
            />
            <InputWithIcon
              label="Stock identifier"
              name="threshold"
              register={register}
              error={errors.threshold}
              placeholder="eg: 140"
            />
            <SelectField
              name="frequency"
              label="Frequency"
              placeholder="Select a frequency"
              error={errors.frequency}
              options={FREQUENCY_OPTIONS}
              control={control}
            />

            <Button type="submit" className="yellow-btn w-full mt-5">
              {isSubmitted ? 'Creating alert...' : 'Create Alert'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PriceAlert
