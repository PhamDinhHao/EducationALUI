import { Button } from 'antd'
import { useCallback, useState } from 'react'
import { EditOutlined } from '@ant-design/icons'

import { EditSentenceModal } from '@editor/components/modals'
import { TNewSentence } from '@/modules/editor/schemas'

type ButtonEditSentenceProps = {
  id: string
  data: TNewSentence
  onFetch: (params: { [key: string]: any }) => void
  queryParams: { [key: string]: any }
}

const ButtonEditSentence: React.FC<ButtonEditSentenceProps> = ({ id, data, onFetch, queryParams }) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false)

  const handleShowModal = useCallback(() => {
    setIsOpenModal(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsOpenModal(false)
  }, [])

  return (
    <>
      <Button className='rounded-md border p-2' onClick={handleShowModal}>
        <EditOutlined />
      </Button>
      {isOpenModal ? <EditSentenceModal data={data} id={id} isOpen={isOpenModal} onClose={handleCloseModal} onFetch={onFetch} queryParams={queryParams} /> : null}
    </>
  )
}

export default ButtonEditSentence
