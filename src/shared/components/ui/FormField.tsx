import { FieldError, UseFormRegister } from 'react-hook-form'
import { cn } from '@/shared/utils'
import { OptionSelect } from '@/shared/core/types/common.type'

type FormFieldProps = React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> & {
  label?: string
  name: string
  type?: React.HTMLInputTypeAttribute
  placeholder?: string
  error?: FieldError
  register: UseFormRegister<any>
  fieldType?: 'input' | 'textarea' | 'select'
  options?: OptionSelect[]
  required?: boolean
  note?: string
  disabled?: boolean
}

const FormField: React.FC<FormFieldProps> = ({
  fieldType = 'input',
  label,
  name,
  type = 'text',
  placeholder,
  className,
  error,
  register,
  options,
  required = false,
  note,
  disabled = false,
  ...props
}) => {
  const renderField = (fieldType: 'input' | 'textarea' | 'select') => {
    switch (fieldType) {
      case 'input':
        return (
          <input
            className={cn('rounded-lg border p-2', error && 'border-red-700', className)}
            id={name}
            placeholder={placeholder}
            type={type}
            {...register(name)}
            {...props}
            disabled={disabled}
          />
        )
      case 'textarea':
        return (
          <textarea
            className={cn('h-full rounded-lg border p-2', error && 'border-red-700', className)}
            id={name}
            placeholder={placeholder}
            {...register(name)}
            {...props}
            rows={5}
          />
        )
      case 'select':
        return (
          <select
            className={cn('h-full rounded-lg border p-2', error && 'border-red-700', className)}
            id={name}
            {...register(name)}
            {...props}
            defaultValue={options && options.length > 0 ? options[0].value : undefined}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      default:
        return null
    }
  }
  return (
    <div className='flex flex-col gap-1 w-full'>
      <div className='flex items-center justify-between gap-1'>
        <label className='font-semibold' htmlFor={name}>
          {label}
          {required ? <span className='ml-1 text-red-600'>*</span> : null}
        </label>
      </div>
      {note && <p className='text-sm text-gray-500 float-left flex'>{note}</p>}
      {renderField(fieldType)}
      <p className='text-sm text-red-600 float-left flex'>{error ? error.message : null}</p>
    </div>
  )
}

export default FormField
