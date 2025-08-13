import { Modal, Button } from 'antd'

type TemplateModalProps = {
  isOpen: boolean
  onClose: () => void
  data: any
}

const TemplateModal = ({ isOpen, onClose, data }: TemplateModalProps) => {
  return (
    <Modal
      centered
      onCancel={onClose}
      open={isOpen}
      title={<div className='text-center text-xl font-bold'>テンプレート</div>}
      footer={false}
      width="100%"
      style={{ top: 0, margin: 0, padding: 0, maxWidth: '100%' }}
      className="!h-screen !overflow-hidden"
      bodyStyle={{
        height: 'calc(100vh - 55px)',
        padding: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className='flex flex-col h-full overflow-hidden'>
        <div className='flex-1 p-2'>
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              <div className='space-y-2'>
                <label className='block text-sm font-semibold'>件名</label>
                <div>{data.subject} </div>
              </div>

              <div className='space-y-2'>
                <label className='block text-sm font-semibold'>本文</label>
                <div 
                  className="max-h-[calc(100vh-250px)] overflow-y-auto" 
                  dangerouslySetInnerHTML={{ __html: data.content }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t bg-white">
          <div className="text-center">
            <Button onClick={onClose}>閉じる</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TemplateModal
