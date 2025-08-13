import { Controller } from 'react-hook-form'
import _ from 'lodash'
import { Radio, Space } from 'antd'
import { OptionSelect } from '@/shared/core/types/common.type'
import { cn } from '@/shared/utils'

type FormRadioDesignProps = {
  control: any
  name: string
  classNames?: string
  options: OptionSelect[]
  label?: string
  value?: number
}

const FormRadioDesign = ({ control, name, options, classNames, label, value = 1 }: FormRadioDesignProps) => {
  return (
    <>
      <div className='flex items-center justify-between gap-1'>
        <label className='font-semibold' htmlFor={name}>
          {label}
        </label>
      </div>
      <Controller
        control={control}
        name={name}
        defaultValue={value}
        render={({ field }) => (
          <Radio.Group
            className={cn(
              '[&_.ant-radio-checked_.ant-radio-inner]:!border-red-500 [&_.ant-radio-checked_.ant-radio-inner]:!bg-red-500 [&_.ant-radio:hover_.ant-radio-inner]:!border-red-500',
              classNames
            )}
            {...field}
          >
            <Space direction='horizontal'>
              {options.map((option) => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
      />
    </>
  )
}

export default FormRadioDesign
