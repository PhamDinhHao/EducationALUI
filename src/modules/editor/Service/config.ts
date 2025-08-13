import { DefaultOptionType } from "antd/es/select"

export enum AddressState {
    HEADER = '作成者署名',
    EMAIL = 'no-reply@gmail.com',
    HEADER2 = '第三者署名',
    EMAIL2 = 'no-reply2@gmail.com',

  }
  
  export const optionsFromAddress: DefaultOptionType[] = [
    { value: 1, label: AddressState.HEADER, disabled: true },
    { value: 2, label: AddressState.EMAIL },
    { value: 3, label: AddressState.HEADER2, disabled: true },
    { value: 4, label: AddressState.EMAIL2 },
  ]
