import { memo } from 'react'
import { OptionSelect } from '@/shared/core/types'
import { Select } from 'antd'
import { UseFormRegister } from 'react-hook-form'

type FormSelectProps = {
  register: UseFormRegister<any>
  name: string
  classNames?: string
  options: OptionSelect[]
  placeholder?: string
  onChange?: (value: any) => void
  value?: any
  label?: string
  required?: boolean
}

const FormSelect = memo(
  ({ register, name, options, classNames, placeholder, onChange, value, label, required = false }: FormSelectProps) => {
    return (
      <>
        {label && (
          <label className='font-semibold'>
            {label}
            {required ? <span className='ml-1 text-red-600'>*</span> : null}
          </label>
        )}
        <Select
          {...register(name)}
          value={value}
          onChange={(selectedValue) => {
            register(name).onChange({ target: { value: selectedValue, name } })
            onChange?.(selectedValue)
          }}
          size='large'
          className={classNames}
          placeholder={placeholder}
          options={options}
        />
      </>
    )
  },
  (prevProps, nextProps) => {
    if (prevProps.options !== nextProps.options || prevProps.value !== nextProps.value) {
      return false
    }
    return true
  }
)

export default FormSelect
