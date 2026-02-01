import { FieldValues } from 'react-hook-form'

import { Input, Label } from '@/components/ui'
import { cn } from '@/lib/utils'
import { FormInputProps } from '@/shared/types/global'

const InputField = <T extends FieldValues>({
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
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn('form-input', { 'opacity-50 cursor-not-allowed': disabled })}
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

export default InputField
