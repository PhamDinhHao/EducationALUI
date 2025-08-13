import { Controller } from "react-hook-form"
import { Radio, Space } from "antd";
import { OptionSelect } from "@/shared/core/types/common.type";
import { cn } from "@/shared/utils";

type FormRadioProps = {
  control: any;
  name: string;
  classNames?: string;
  options: OptionSelect[];
};

const FormRadio = ({ control, name, options, classNames }: FormRadioProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Radio.Group className={cn("flex flex-col gap-4 rounded-md border bg-[#dddd] px-4 py-6", classNames)} {...field}>
          <Space direction='vertical'>
            {options.map((option) => (
              <Radio key={option.value} value={option.value}>{option.label}</Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
    />
  )
}

export default FormRadio
