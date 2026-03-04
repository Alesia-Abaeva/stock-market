import { DollarSign, DollarSignIcon } from 'lucide-react'
import { FieldValues } from 'react-hook-form'

import { Input, Label } from '@/components/ui'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { FormInputProps } from '@/shared/types/global'

const InputWithIcon = <T extends FieldValues>({
  label,
  name,
  placeholder,
  register,
  disabled,
  error,
  type = 'text',
  validation,
  value,
}: FormInputProps<T>) => {
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
          {...register(name, validation)}
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
