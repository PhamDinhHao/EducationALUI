import { useCallback, useState } from 'react'
import { UploadFile, UploadProps } from 'antd'
import { getBase64 } from '@/modules/line/utils'

const useLine = (getValues: any, setError: any, setValue: any) => {
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const buttons = getValues('buttons') || []
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File)
    }
    setPreviewImage(file.url || (file.preview as string))
  }

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    setValue('file', newFileList[0].originFileObj as File)
    setError('file', { type: 'manual', message: '' })
  }

  const handleAddButton = useCallback(() => {
    const newButton = {
      id: Date.now(),
      label: ``,
      value: ``
    }
    const updatedButtons = [...buttons, newButton]
    setValue('buttons', updatedButtons)
  },[buttons])

  const handleDeleteButton = useCallback((id: number) => () => {
    const updatedButtons = buttons.filter((btn: any) => btn.id !== id)
    setValue('buttons', updatedButtons)
  },[buttons])
  return {
    previewImage,
    fileList,
    setPreviewImage,
    setFileList,
    handlePreview,
    handleChange,
    addButton: handleAddButton,
    handleDeleteButton
  }
}
export default useLine
