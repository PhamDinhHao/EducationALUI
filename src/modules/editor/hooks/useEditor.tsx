import toast from 'react-hot-toast'
import {
  useDeleteTemplate,
  useEditNameTemplate,
} from '@templates/services/mutation'
import { useSharedStore } from '@/shared/stores/shared.store'
import { useQueryClient } from '@tanstack/react-query'
import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { useBoundStore } from '@/shared/stores'
import { useCallback } from 'react'
import { createTemplate, updateTemplate } from '@/shared/services/template.service'
import { TemplateData } from '@/modules/editor/core/types/template.type'
import { formatDateTime } from '@/modules/editor/util'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'
import { TEMPLATE_QUERY_KEY } from '@/modules/templates/services/config'

const useEditor = () => {
  const queryClient = useQueryClient()
  const { nameTemplate, content, setContent: onChangeContent, setNameTemplate: onSetNameTemplate, setSubject } = useBoundStore()
  const { setErrorContent, setErrorSubject } = useErrorSendMailStore()
  const { mutateAsync: editNameTemplate } = useEditNameTemplate()
  const { mutateAsync: deleteTemplate } = useDeleteTemplate()
  const { setIsLoading } = useSharedStore()

  const onSaveTemplate = async (content: string, addressTo: string | number, addressToType: string, fromAddress: string | number, subject: string, deliveryType: string, date: string, hours: string, minutes: string, type: TemplateType) => {
    let hasError = false
    if (content?.trim() === '') {
      setErrorContent('本文の入力は必須です。')
      hasError = true
    }
    if (subject?.trim() === '') {
      setErrorSubject('件名の入力は必須です。')
      hasError = true
    }
    if (hasError) return
    const templateData: TemplateData = {
      name: nameTemplate,
      subject,
      content,
      type,
      image: null,
      deliveryType,
      emailSettingId: fromAddress ? fromAddress : null,
      addressTo: addressToType === 'all' ? "" : addressTo,
      addressToType,
      scheduledAt: formatDateTime(date.toString(), Number(hours), Number(minutes))
    }

    await createTemplate(templateData)
      .then(() => {
        onChangeContent('')
        setSubject('')
        onChangeContent('')
        queryClient.invalidateQueries({ queryKey: [TEMPLATE_QUERY_KEY] })
      })
  }

  const onEditNameTemplate = (id: string) => {
    setIsLoading(true)
    editNameTemplate({ id, name: nameTemplate })
      .then(() => { })
      .catch(() => {
        toast.error('Change name failed!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const handleEditTemplate = useCallback(async (id: string, data: any) => {
    await updateTemplate(id, data).then(() => {
      queryClient.invalidateQueries({ queryKey: [TEMPLATE_QUERY_KEY] })
    })
  }, [])

  const onDeleteTemplate = (id: string) => {
    setIsLoading(true)
    deleteTemplate({ id })
      .then(() => { })
      .catch(() => {
        toast.error('Delete failed!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return {
    nameTemplate,
    content,
    onChangeContent,
    onSetNameTemplate,
    onSaveTemplate,
    onEditNameTemplate,
    onDeleteTemplate,
    onEditTemplate: handleEditTemplate
  }
}

export default useEditor
