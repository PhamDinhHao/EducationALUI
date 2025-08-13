import { Input, Layout } from 'antd'

import TabBar from '@editor/components/layout/TabBar'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'
import { useBoundStore } from '@/shared/stores'

const { Sider: SiderAntd } = Layout
const Sider: React.FC = () => {
  const { subject, setSubject } = useBoundStore()
  const { errorSubject, setErrorSubject } = useErrorSendMailStore()
  return (
    <SiderAntd className='flex flex-col overflow-auto border-l border-[#ccc] bg-[#fafafa]' theme='light' width='30%'>
      <div className='flex w-full items-center gap-2 bg-[#fafafa] px-4 py-2'>
        <label className='flex w-12 gap-1 text-xs font-semibold lg:text-sm' htmlFor='subject'>
          件名 <span className='text-red-700'>*</span>
        </label>
        <Input 
          className='h-9 text-xs lg:text-sm' 
          id='subject'
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value)
            setErrorSubject('')
          }}
        />
      </div>
      {errorSubject && <p className='text-red-600 ml-4 py-2'>{errorSubject}</p>}
      <TabBar />
    </SiderAntd>
  )
}

export default Sider
