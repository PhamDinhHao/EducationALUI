import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Tooltip, Upload } from 'antd'
import { DownloadOutlined, QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import templateCSV from '/csv/ADD_create.csv?url'
import ListDistributions from '@/modules/mngRecipients/components/Group/ListDistributions'
import { Group } from '@/shared/core/types/group.type'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormValuesBulkRegister } from '@/modules/mngRecipients/core/types/recipient.type'
import { BulkRegistrationSchema, initFormBulkRegister } from '@/modules/mngRecipients/core/config/form/bulk-register-form'
import useHandleForm from '@/shared/hooks/useHandleForm'
import { importRecipient } from '@/modules/mngRecipients/services/recipient.service'
import FormRadio from '@/shared/components/Radio/FormRadio'
import { typeImportOptions } from '@/modules/mngRecipients/core/config/select-options'

interface BulkRegistrationProps {
  onClose: () => void
  groupList: Group[]
  onFetchGroupList: () => void
}

const BulkRegistration: React.FC<BulkRegistrationProps> = ({ onClose, groupList, onFetchGroupList }) => {
  const [checkedIds, setCheckedIds] = useState<number[]>([])
  const {
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors }
  } = useForm<FormValuesBulkRegister>({
    resolver: zodResolver(BulkRegistrationSchema),
    values: initFormBulkRegister,
    mode: 'all'
  })

  const handleSubmitForm = async (values: FormValuesBulkRegister) => {
    return await importRecipient(values)
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
    const fileName = templateCSV.split('/').pop() || 'ADD_create.csv'
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const handleCheckboxChange = useCallback((checked: boolean, id: number) => {
    setCheckedIds((prev) => {
      const newCheckedIds = [...prev]
      if (checked) {
        newCheckedIds.push(id)
      } else {
        newCheckedIds.splice(newCheckedIds.indexOf(id), 1)
      }
      setValue('groupId', newCheckedIds.join(','))
      return newCheckedIds
    })
  }, [])

  return (
    <form data-tab='1' onSubmit={handleSubmit(onSubmitForm)}>
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
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <span className='flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white'>2</span>
            <span className='font-semibold'>CSVファイルを選択</span>
          </div>
          <FormRadio
            control={control}
            name='importType'
            options={typeImportOptions}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-2'>
            <span className='flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white'>3</span>
            <span className='font-semibold'>リストを選択（任意）</span>
            <Tooltip
              title={
                <p>
                  特定の読者に配信したい場合にはリ ストを選択してください。
                  <br />
                  ※未選択の場合でも読者一覧には登 録されます
                </p>
              }
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <div className='flex flex-col gap-4 rounded-md border bg-[#dddd] px-4 py-6'>
            <ListDistributions
              groupList={groupList}
              onCheckboxChange={handleCheckboxChange}
              checkedIds={Array.from(checkedIds)}
              onFetchGroupList={onFetchGroupList}
            />
          </div>
        </div>
      </div>
    </form>
  )
}

export default BulkRegistration
