import { Controller } from 'react-hook-form'

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import type { SelectFieldProps } from '@/shared/types/global'

const SelectField = ({
  control,
  options,
  required = false,
  label,
  name,
  placeholder,
  error,
}: SelectFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600 text-white">
              {options.map(({ label, value }) => (
                <SelectItem value={value} key={value} className="focus:bg-gray-600 text-white">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      ></Controller>

      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  )
}

export default SelectField
