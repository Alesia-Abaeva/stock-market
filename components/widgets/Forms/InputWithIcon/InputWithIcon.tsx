import { DollarSign } from 'lucide-react'
import React from 'react'
import type { FieldError } from 'react-hook-form'

import { Label } from '@/components/ui'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'

type InputWithIconProps = React.ComponentProps<'input'> & {
  label: string
  error?: FieldError
}

const InputWithIcon = ({
  label,
  name,
  placeholder,
  disabled,
  error,
  type = 'text',
  value,
  ...props
}: InputWithIconProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <InputGroup className={cn('form-input ', { 'opacity-50 cursor-not-allowed': disabled })}>
        <InputGroupInput
          type={type}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          className="p-0"
          {...props}
        />

        <InputGroupAddon className="pl-0">
          <DollarSign className="text-yellow-500 opacity-100" />
        </InputGroupAddon>
        {error && <p className="text-sm text-red-500">{error.message}</p>}
      </InputGroup>
    </div>
  )
}

export default InputWithIcon
