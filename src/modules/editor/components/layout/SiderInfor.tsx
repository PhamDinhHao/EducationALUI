import { DELIVERY_TYPES } from '@/modules/editor/core/enum/distribution-setting.enum'
import { useBoundStore } from '@/shared/stores'
import { Layout } from 'antd'

const { Sider: SiderAntd } = Layout
const SiderInfor: React.FC = () => {
  const { subject, nameAddressTo, nameFromAddress, deliveryType, date, hours, minutes, isClickMeasure } = useBoundStore()

  return (
    <SiderAntd 
      className='flex flex-col overflow-auto border-l border-[#ccc] bg-[#fafafa]' 
      theme='light' 
      width='30%'
    >
      <div className="p-6">
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-6 border-b pb-3">
            メール情報
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">件名:</label>
            <label className="block w-full p-2">
              {subject}
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">宛先:</label>
            <label className="block w-full p-2">
              {nameAddressTo ?? '全登録者'}
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">送信元アドレス:</label>
            <label className="block w-full p-2">
              {nameFromAddress}
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">クリック測定:</label>
            <label className="block w-full p-2">
              {isClickMeasure ? '測定する' : '測定しない'}
            </label>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">配信日時:</label>
            <label className="block w-full p-2">
              {deliveryType === DELIVERY_TYPES.SCHEDULED ? `${date.format('YYYY/MM/DD')} ${hours}:${minutes}` : '即時配信'}
            </label>
          </div>
        </div>
      </div>
    </SiderAntd>
  )
}

export default SiderInfor
