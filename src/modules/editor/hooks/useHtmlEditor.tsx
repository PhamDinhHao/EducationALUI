import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import type { Editor } from 'grapesjs'
import { getEditorConfig, getHTML } from '@editor/lib/helper'
import { templates } from '@templates/mocks/designed'
import TemplateService from '@templates/services/service'
import dayjs from 'dayjs'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { Asset as AssetType } from '@/modules/editor/types'
import { fetchAssetList } from '@/modules/editor/server-action/asset-list'
import { useBoundStore } from '@/shared/stores'
import { DELIVERY_TYPES, TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { createReservation, getReservation, updateReservation } from '@/shared/services/reservation.service'
import { formatDateTime } from '@/modules/editor/util'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'
import { decamelizeKeys } from 'humps'

const useHtmlEditor = () => {
  const editorRef = useRef<Editor | null>(null)
  const [htmlEditor, setHtmlEditor] = useState<Editor | null>(null)
  const [searchParams] = useSearchParams()
  const { dataTable ,onFetch } = useFetchDataTable<AssetType>(fetchAssetList)
  const [temporaryContent, setTemporaryContent] = useState<string>('')

  useEffect(() => {
    onFetch({ page: 1 })
  }, [])
  const { addressToId, fromAddress, addressToType, subject, deliveryType, date, hours, minutes,isClickMeasure, setAddressToType,setSubject,setAddressToId, setFromAddress, setDeliveryType, setDate, setHours, setMinutes, setAddressTo, setIsClickMeasure } = useBoundStore()
  const { setErrorContent, setErrorSubject } = useErrorSendMailStore()


  useEffect(() => {
    if (!editorRef.current) {
      const editor = getEditorConfig([])
      editorRef.current = editor
      setHtmlEditor(editor)
    }
  }, [])

  useEffect(() => {
    if (dataTable && dataTable.length > 0 && editorRef.current) {
      editorRef.current.AssetManager.add(dataTable.map(asset => ({
        id: asset.id,
        name: asset.name,
        src: asset.src
      })))
    }
  }, [dataTable])

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const type = searchParams.get('type')
    const action = searchParams.get('action')
    const id = searchParams.get('id')
    if (type === 'upload') {
      editor.StorageManager.destroy()
      editor.runCommand('import')
    }

    if (action === 'edit' && type === null && id) {
      editor.StorageManager.destroy()
      TemplateService.getById(id)
        .then((template) => {
          const {content, subject, emailSettingId, date, hour, minute, addressTo, addressToId, addressToType,} = template.data
          setTemporaryContent(content)
          editor?.setComponents(content)
          setSubject(subject)
          setFromAddress(emailSettingId)
          setDeliveryType(date ? DELIVERY_TYPES.SCHEDULED : DELIVERY_TYPES.IMMEDIATE)
          setDate(dayjs(date))
          setHours(hour)
          setMinutes(minute)
          setAddressTo(addressTo)
          setAddressToId(addressToId)
          setAddressToType(addressToType)
        })
        .catch(() => {
          toast.error('Load template failed')
        })
    }
    if (action === 'edit' && type === 'draff' && id) {
      editor.StorageManager.destroy()
      getReservation(id)
        .then((reservation) => {
          const {content, subject, emailSettingId, date, hour, minute, addressTo, addressToId, addressToType, isClickMeasure} = reservation.data.data
          setTemporaryContent(content)
          editor?.setComponents(content)
          setSubject(subject)
          setFromAddress(emailSettingId)
          setDeliveryType(date ? DELIVERY_TYPES.SCHEDULED : DELIVERY_TYPES.IMMEDIATE)
          setDate(dayjs(date))
          setHours(hour)
          setMinutes(minute)
          setAddressTo(addressTo)
          setAddressToId(addressToId)
          setAddressToType(addressToType)
          setIsClickMeasure(isClickMeasure)
        })
    }

    if (action === 'create' && id) {
      editor.StorageManager.destroy()
      const templateHtml = templates.find((template) => template.id === id)
      if (templateHtml) {
        editor?.setComponents(templateHtml.content)
      }
    }
  }, [searchParams])

  const handleSaveDraft = async () => {
    const content = htmlEditor ? getHTML(htmlEditor) : ''
    if (!content) {
      setErrorContent('コンテンツを入力してください')
      return
    }
    if (!subject) {
      setErrorSubject('件名が未入力です')
      return
    }
    const data = {
      content,
      addressTo: addressToType === 'all' ? "" : addressToId,
      addressToType: addressToType,
      emailSettingId: fromAddress,
      subject,
      deliveryType,
      isClickMeasure,
      emailType: TemplateType.HTML,
      scheduled_at: formatDateTime(date.toString(), Number(hours), Number(minutes)),
      isDraft: 1
    }
    if (!content) {
      toast.error('コンテンツを入力してください')
      return
    }
    try {
      const action = searchParams.get('action')
      const type = searchParams.get('type')
      const id = searchParams.get('id')

      const isEditingDraft = action === 'edit' && type === 'draff'
      
      const dataPath = { ...decamelizeKeys(data) }
      isEditingDraft && id
        ? await updateReservation(id, dataPath)
        : await createReservation(dataPath)
    } catch (error) {
      toast.error('下書きの保存に失敗しました')
    }
  }

  const handleSendMail = async () => {
    const content = htmlEditor ? getHTML(htmlEditor) : ''
    const data = {
      content,
      addressTo: addressToType === 'all' ? '' : addressToId,
      addressToType: addressToType,
      emailSettingId: fromAddress,
      subject,
      deliveryType,
      isClickMeasure,
      emailType: TemplateType.HTML,
      scheduled_at: formatDateTime(date.toString(), Number(hours), Number(minutes)),
      isDraft: 0
    }

    await createReservation(decamelizeKeys(data))
  }

  return {
    editor: htmlEditor,
    handleSaveDraft,
    onSendMail: handleSendMail,
    temporaryContent,
    setTemporaryContent
  }
}

export default useHtmlEditor
