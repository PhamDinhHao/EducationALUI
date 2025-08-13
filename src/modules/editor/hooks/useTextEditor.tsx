import Quill from 'quill'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import useEditor from './useEditor'
import dayjs from 'dayjs'
import { UploadFile } from 'antd'
import { RcFile } from 'antd/es/upload'
import { useBoundStore } from '@/shared/stores'
import { DEFAULT_TIME, DELIVERY_TYPES, TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { fetchTemplateDetail } from '@/shared/server-action/template-list'
import { createReservation, getReservation, updateReservation } from '@/shared/services/reservation.service'
import { formatDateTime } from '@/modules/editor/util'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'
import { decamelizeKeys } from 'humps'

const useTextEditor = () => {
  const [searchParams] = useSearchParams()
  const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([])
  const { content, onChangeContent, onSaveTemplate, onEditTemplate } = useEditor()
  const { isClickMeasure, addressToId, addressToType, fromAddress, subject, deliveryType, date, hours, minutes, setIsClickMeasure, setAddressToType, setAddressToId, setSubject, setFromAddress, setDeliveryType, setDate, setHours, setMinutes, setAddressTo, setContent, setNameFromAddress } = useBoundStore()
  const { setErrorContent, setErrorSubject } = useErrorSendMailStore()
  const editorRef = useRef<Quill>()
  const [textEditor, setTextEditor] = useState<Quill>()
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    const fetchTemplate = async () => {
      if (searchParams.get('action') === 'edit' && searchParams.get('type') === null) {
        const id = searchParams.get('id')
        if (!id) return
        const template = await fetchTemplateDetail(id)
        if (template) {
          const { content, subject, date, hour, minute, addressTo, addressToId, addressToType, emailSettingId } = template
          setFromAddress(emailSettingId)
          onChangeContent(content)
          setSubject(subject)
          setDate(dayjs(date))
          setHours(hour)
          setMinutes(minute)
          setDeliveryType(date ? DELIVERY_TYPES.SCHEDULED : DELIVERY_TYPES.IMMEDIATE)
          setDate(dayjs(date) ? dayjs(date) : dayjs(new Date()))
          setHours(hour ? hour : DEFAULT_TIME.HOURS)
          setMinutes(minute ? minute : DEFAULT_TIME.MINUTES)
          setAddressToId(addressToId)
          setAddressTo(addressTo)
          setAddressToType(addressToType)
        }
      } else if (searchParams.get('action') === 'edit' && searchParams.get('type') === 'draff') {
        const id = searchParams.get('id')
        if (!id) return
        getReservation(id)
          .then((reservation) => {
            const { content, subject, emailSettingId, date, hour, minute, addressTo, addressToId, addressToType, isClickMeasure, deliveryType, sourceAddress} = reservation.data.data
            onChangeContent(content)
            setNameFromAddress(sourceAddress)
            setSubject(subject)
            setFromAddress(emailSettingId)
            setDeliveryType(deliveryType)
            setDate(date ? dayjs(date) : dayjs(new Date()))
            setHours(hour ? hour : DEFAULT_TIME.HOURS)
            setMinutes(minute ? minute : DEFAULT_TIME.MINUTES)
            setAddressToId(addressToId)
            setAddressTo(addressTo)
            setAddressToType(addressToType)
            setIsClickMeasure(isClickMeasure)
          })
      }
    }
    fetchTemplate()

    return () => {
      if (searchParams.get('action') === 'edit') {
        onChangeContent('')
      }
    }
  }, [searchParams, onChangeContent])

  useEffect(() => {
    if (textEditor) {
      textEditor.clipboard.dangerouslyPasteHTML(content)
    }
  }, [textEditor, content])

  const handleSaveTemplate = () => {
    const content = textEditor?.getSemanticHTML() || '';
    if (content && textEditor?.getText().trim() === '') {
      setErrorContent('コンテンツを入力してください');
      return;
    }

    const data = { content, subject, addressTo: addressToType === 'all' ? "" : addressToId, addressToType, emailSettingId: fromAddress, deliveryType, date, hours, minutes, isClickMeasure };
    const action = searchParams.get('action');
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    const saveTemplate = () => {
      const dateString = date.toString();
      const hoursString = hours.toString();
      const minutesString = minutes.toString();
      const addressTo = addressToType === 'all' ? "" : addressToId
      onSaveTemplate(
        content,
        addressTo,
        String(addressToType),
        fromAddress,
        subject,
        deliveryType,
        dateString,
        hoursString,
        minutesString,
        TemplateType.TEXT,
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
  };


  const handleSaveDraft = async () => {
    const content = textEditor?.getSemanticHTML()
    let hasError = false

    if (content && textEditor?.getText().trim() === '') {
      setErrorContent('本文の入力は必須です。')
      hasError = true
    }
    if (!subject) {
      setErrorSubject('件名の入力は必須です。')
      hasError = true
    }

    if (hasError) return
    const data = {
      content,
      addressTo: addressToType === 'all' ? "" : addressToId,
      addressToType,
      emailSettingId: fromAddress,
      subject,
      deliveryType,
      isClickMeasure,
      emailType: TemplateType.TEXT,
      scheduled_at: formatDateTime(date.toString(), Number(hours), Number(minutes)),
      isDraft: 1,
      attachments: fileList[0] ? fileList[0].originFileObj : null
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
      const dataPath = { ...decamelizeKeys(data), attachments: fileList[0] ? fileList[0].originFileObj : null }

      isEditingDraft && id
        ? await updateReservation(id, dataPath)
        : await createReservation(dataPath)
    } catch (error) {
    }
  }

  const handleSendMail = async () => {
    const content = textEditor?.getSemanticHTML();
    const data = {
      content,  
      addressTo: addressToType === 'all' ? '' : addressToId,
      addressToType,
      emailSettingId: fromAddress,
      subject,
      deliveryType,
      isClickMeasure,
      emailType: TemplateType.TEXT,
      scheduled_at: formatDateTime(date.toString(), Number(hours), Number(minutes)),
      isDraft: 0,
    }
    const dataPath = { ...decamelizeKeys(data), attachments: fileList[0] ? fileList[0].originFileObj : null }
    await createReservation(dataPath)
  }

  // Initialize editor instance only once
  useEffect(() => {
    if (!editorRef.current) {
      const editor = new Quill('#quill', {
        theme: 'snow',
        modules: {
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link'],
              [{ '': '' }, { '[]': '[]' }],
              [{ '': '' }, { '[]': '[]' }],
              ['desktop', 'mobile']
            ],
            handlers: {
              link: function (value: boolean) {
                if (value === false) {
                  editor.format('link', false)
                } else {
                  const selection = editor.getSelection()
                  if (selection && selection.length <= 0) {
                    return
                  }
                  const inputContainer = document.createElement('div')
                  
                  const label = document.createElement('label')
                  label.style.marginLeft = '8px'
                  label.innerText = 'リンクを入力してください :'
                  inputContainer.appendChild(label)

                  const input = document.createElement('input')
                  input.type = 'text'
                  input.placeholder = 'URLを入力してください'
                  input.style.width = '200px'
                  input.style.marginLeft = '10px'
                  inputContainer.appendChild(input)

                  const saveButton = document.createElement('label')
                  saveButton.innerText = '保存'
                  saveButton.style.marginLeft = '20px'
                  saveButton.style.marginRight = '10px'
                  saveButton.style.cursor = 'pointer'
                  saveButton.style.color = 'rgb(52, 152, 219)'

                  saveButton.onclick = () => {
                    const url = input.value
                    if (url) {
                      editor.format('link', url)
                    } else {
                      editor.format('link', false)
                    }
                    inputContainer.remove()
                  }
                  editor.format('link', false)

                  inputContainer.appendChild(saveButton)

                  inputContainer.style.marginTop = '10px'
                  inputContainer.style.padding = '5px'
                  inputContainer.style.width = 'fit-content'
                  inputContainer.style.boxShadow = '0 0 10px 0 rgba(0, 0, 0, 0.1)'

                  const toolbar = document.querySelector('.ql-toolbar')
                  if (toolbar) {
                    toolbar.appendChild(inputContainer)
                  }
                }
              },
              desktop: function () {
                toggleDeviceType()
              },
              mobile: function () {
                toggleDeviceType()
              }
            }
          }
        }
      })
      const desktopButton = document.querySelector('.ql-desktop');
      const mobileButton = document.querySelector('.ql-mobile');
      if (desktopButton) desktopButton.innerHTML = '💻';
      if (mobileButton) mobileButton.innerHTML = '📱';

      editorRef.current = editor
      setTextEditor(editor)
      setContent(editor.getSemanticHTML())
    }
  }, [])

  const toggleDeviceType = () => {
    setDeviceType(prev => prev === 'desktop' ? 'mobile' : 'desktop')
  }
  return { fileList, textEditor, handleSaveTemplate, handleSaveDraft, setFileList, onSendMail: handleSendMail, setContent, deviceType }
}

export default useTextEditor
