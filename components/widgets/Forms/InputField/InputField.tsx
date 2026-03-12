import React from 'react'
import type { FieldError } from 'react-hook-form'

import { Input, Label } from '@/components/ui'
import { cn } from '@/lib/utils'

type InputFieldProps = React.ComponentProps<'input'> & {
  label: string
  error?: FieldError
}

const InputField = ({
  label,
  name,
  placeholder,
  disabled,
  error,
  type = 'text',
  value,
  ...props
}: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn('form-input', { 'opacity-50 cursor-not-allowed': disabled })}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

export default InputField
