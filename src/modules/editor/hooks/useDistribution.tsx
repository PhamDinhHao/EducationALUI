// import { useGroup } from '@/modules/group/hooks/useGroup'
// import { DefaultOptionType } from 'antd/es/cascader'
// import { useState } from 'react'
// import dayjs, { Dayjs } from 'dayjs'
// import { DEFAULT_TIME, DELIVERY_TYPES } from '@/modules/editor/core/enum/distribution-setting.enum'
// import { DeliveryType } from '@/modules/editor/core/types/distribution-setting.type'

// const useDistribution = () => {
//   const { dataSource } = useGroup()

//   const addressOptions: DefaultOptionType[] = [
//     { value: 'all', label: '全登録者' },
//     { value: 'list', label: `リスト (${dataSource.length}件)`, disabled: true },
//     ...dataSource.map((item: { id: string; name: string }) => ({
//       value: item.id,
//       label: item.name
//     }))
//   ]
//   const [deliveryType, setDeliveryType] = useState<DeliveryType>(DELIVERY_TYPES.SCHEDULED)
//   const [date, setDate] = useState<Dayjs>(dayjs())
//   const [hours, setHours] = useState(DEFAULT_TIME.HOURS)
//   const [minutes, setMinutes] = useState(DEFAULT_TIME.MINUTES)

//   return {
//     dataSource,
//     addressOptions,
//     deliveryType,
//     date,
//     hours,
//     minutes,
//     setDeliveryType,
//     setDate,
//     setHours,
//     setMinutes
//   }
// }

// export default useDistribution
