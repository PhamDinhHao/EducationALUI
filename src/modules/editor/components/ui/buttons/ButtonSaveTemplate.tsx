import { useCallback, useState } from 'react'
import { Button, Modal } from 'antd'
import { useSearchParams } from 'react-router-dom'
import { useEditor } from '@editor/hooks'
import { getHTML } from '@editor/lib/helper'
import type { Editor } from 'grapesjs'
import { FormField } from '@/shared/components/ui'
import { SubmitHandler, useForm } from 'react-hook-form'
import { NewTemplateSchema } from '@/modules/editor/schemas/newTemplate.schema'
import { TNewTemplate } from '@/modules/editor/schemas/newTemplate.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBoundStore } from '@/shared/stores'
import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'

type ButtonSaveTemplateProps = {
  onSave: () => void
}

const ButtonSaveTemplate: React.FC<ButtonSaveTemplateProps> = ({ onSave }) => {
  const [isModalSaveOpen, setIsModalSaveOpen] = useState(false)
  const { onSetNameTemplate } = useEditor()
  const [searchParams] = useSearchParams()
  const handleSave = () => {
    const action = searchParams.get('action')
    const type = searchParams.get('type')

    if (action === 'edit') {
      if (!type) {
        return onSave()
      }
      if (type === 'draff') {
        return handleShowModal()
      }
    }

    handleShowModal()
  }

  const handleShowModal = () => {
    setIsModalSaveOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalSaveOpen(false)
    onSetNameTemplate('')
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TNewTemplate>({
    resolver: zodResolver(NewTemplateSchema),
    defaultValues: {
      name: ''
    }
  })
  const onSubmit: SubmitHandler<TNewTemplate> = () => {
    onSave()
    handleClose()
  }

  const handleClose = useCallback(() => {
    handleCloseModal()
    reset({
      name: ''
    })
    onSetNameTemplate('')
  }, [reset])
  return (
    <>
      <Button
        onClick={handleSave}
      >{`Myテンプレート${searchParams.get('action') === 'edit' ? '上書き' : ''}保存`}</Button>
      <Modal
        cancelText='キャンセル'
        centered
        okText='Myテンプレート保存'
        onCancel={handleCloseModal}
        onOk={handleSubmit(onSubmit)}
        open={isModalSaveOpen}
        title={<p className='text-center text-lg'>Myテンプレート名入力</p>}
      >
        <form className='flex flex-col gap-2'>
          <FormField
            className='rounded-lg border p-2'
            error={errors.name}
            label='Myテンプレート名'
            name='name'
            register={register}
            type='text'
            required={true}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSetNameTemplate(e.target.value)}
          />
        </form>
      </Modal>
    </>
  )
}

const ButtonSaveTemplateHtml: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [searchParams] = useSearchParams()
  const { onSaveTemplate, onEditTemplate } = useEditor()
  const { addressToId, addressToType, fromAddress, subject, deliveryType, date, hours, minutes } = useBoundStore()
  const action = searchParams.get('action')
  const type = searchParams.get('type')
  const id = searchParams.get('id')

  const handleSave = () => {
    const html = getHTML(editor)
    const data = {
      content: html === '<p></p>' ? '' : html,
      addressTo: addressToType === 'all' ? "" : addressToId,
      addressToType: addressToType,
      emailSettingId: fromAddress,
      subject: subject,
      deliveryType: deliveryType,
      date: date,
      hours: hours,
      minutes: minutes,
      type: TemplateType.HTML
    }
    const saveTemplate = () => {
      const dateString = date.toString();
      const hoursString = hours.toString();
      const minutesString = minutes.toString();

      onSaveTemplate(
        html,
        addressToType === 'all' ? "" : addressToId,
        String(addressToType),
        String(fromAddress),
        subject,
        deliveryType,
        dateString,
        hoursString,
        minutesString,
        TemplateType.HTML
      );
    };

    if (action === 'edit') {
      if (!type && id) {
        onEditTemplate(id, data);
      } else if (type === 'draff') {
        saveTemplate();
      }
    } else {
      saveTemplate();
    }


  }

  return <ButtonSaveTemplate onSave={handleSave} />
}
export { ButtonSaveTemplateHtml, ButtonSaveTemplate }
