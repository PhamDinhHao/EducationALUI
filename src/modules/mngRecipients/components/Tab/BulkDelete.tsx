import { Button, Tooltip, Upload, UploadProps } from 'antd'
import { DownloadOutlined, QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons'
import templateCSV from '/csv/ADD_delete.csv?url'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { FormValuesBulkDelete } from '@/modules/mngRecipients/core/types/recipient.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { BulkDeleteSchema, initFormBulkDelete } from '@/modules/mngRecipients/core/config/form/bulk-delete-form'
import { importDeleteRecipient } from '@/modules/mngRecipients/services/recipient.service'
import useHandleForm from '@/shared/hooks/useHandleForm'
interface BulkDeleteProps {
  onClose: () => void,
}

const BulkDelete: React.FC<BulkDeleteProps> = ({ onClose }) => {
  const {
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm<FormValuesBulkDelete>({
    resolver: zodResolver(BulkDeleteSchema),
    values: initFormBulkDelete,
    mode: 'all'
  })

  const handleSubmitForm = async (values: FormValuesBulkDelete) => {
    return await importDeleteRecipient(values)
  }

  const { onSubmitForm } = useHandleForm({
    onSubmit: handleSubmitForm,
    setError,
    isValidForm: true,
    fnAfterSubmit: onClose
  }) 
  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    maxCount: 1,
    headers: {
      authorization: 'authorization-text'
    },
    beforeUpload: (file) => {
      const maxSize = 30 * 1024 * 1024
      if (file.size > maxSize) {
        setError('file', { message: 'ファイルサイズは30MB以下にしてください。' })
        return false
      }
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      setValue('file', dataTransfer.files[0])
      return false
    }
  }

  const handleDownloadCSV = useCallback(() => {
    const link = document.createElement('a')
    link.href = templateCSV
    const fileName = templateCSV.split('/').pop() || 'ADD_delete.csv'
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  return (
    <form data-tab='2' onSubmit={handleSubmit(onSubmitForm)}>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <span className='flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white'>1</span>
            <span className='font-semibold'>CSVファイルを選択</span>
            <Button onClick={handleDownloadCSV}>
              <DownloadOutlined />
              <span>登録用CSVダウンロード</span>
            </Button>
            <Tooltip title='登録用CSVに登録する読者データを追加してCSVをアップロードしてください。'>
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <div className='flex flex-col gap-4 rounded-md border bg-[#dddd] px-4 py-6'>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>ファイルを選択</Button>
            </Upload>
            <div className='flex gap-2'>
              <p>ファイル形式: .csv</p>
              <p>容量：30MBまで</p>
            </div>
            <p className='text-sm text-red-600 float-left flex'>{errors.file?.message}</p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default BulkDelete
