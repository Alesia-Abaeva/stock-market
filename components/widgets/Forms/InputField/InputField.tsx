import { DollarSign } from 'lucide-react'
import React from 'react'
import type { FieldError } from 'react-hook-form'

import { Input, Label } from '@/components/ui'
import { cn } from '@/lib/utils'

type InputFieldProps = React.ComponentProps<'input'> &
  React.PropsWithChildren & {
    label: string
    error?: FieldError
    withIcon?: boolean
  }

const InputField = ({
  label,
  name,
  placeholder,
  disabled,
  error,
  withIcon,
  type = 'text',
  ...props
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <div className="relative">
        {withIcon && (
          <DollarSign className="text-yellow-500 opacity-100 w-4 h-4 absolute left-2 top-[26.5px] transform -translate-y-1/2" />
        )}
        <Input
          {...props}
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'form-input ',
            { 'opacity-50 cursor-not-allowed': disabled },
            { 'pl-8!': withIcon }
          )}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

export default InputField
