import { Button } from 'antd'
import { Delta } from 'quill/core'
import './TextEditor.style.scss'
import 'quill/dist/quill.snow.css'
import { cn, isHTML } from '@/shared/utils'
import { useTextEditor } from '@editor/hooks'
import { fileAccept, maxFileSize, uploadProps } from '@editor/constants'
import { Footer } from '@editor/components/layout'
import { FileUpload } from '@/shared/components/ui'
import { ButtonSaveTemplate } from '@editor/components/ui'
import { useCallback, useEffect } from 'react'
import Upload, { UploadFile } from 'antd/es/upload'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'
import type { RcFile } from 'antd/es/upload/interface'
import { useBoundStore } from '@/shared/stores'
import useHandleModal from '@/shared/hooks/useHandleModal'
import SendMailPreviewModal from '@/modules/editor/components/modals/SendMailPreviewModal'
import SaveModal from '@/modules/editor/components/SaveModal'
import { useNavigate } from 'react-router-dom'
import { PagePath } from '@/shared/core/enum/page.enum'

const TextEditor: React.FC = () => {
  const navigate = useNavigate()
  const { modalName, onSetModalName, onResetModalName } = useHandleModal()
  const { textEditor, handleSaveTemplate, handleSaveDraft, fileList, setFileList, onSendMail, setContent, deviceType } = useTextEditor()
  const { signature, content, subject, reset, resetEditor } = useBoundStore()
  const { isConfirm, errorContent, setErrorContent, setErrorSubject, setIsConfirm, resetErrorSendMail } = useErrorSendMailStore()

  const handleOpenSendMailPreview = useCallback(() => {
    onSetModalName('sendMailPreview')
  }, [])

  useEffect(() => {
    if (textEditor) {
      textEditor.enable(isConfirm)
      textEditor.on('text-change', () => {
        setErrorContent('')
      })
    }
  }, [textEditor, isConfirm])

  const customUploadProps = {
    ...uploadProps,
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile<RcFile>[] }) => {
      setFileList(newFileList.slice(-1))
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    // Stop data actually being pasted into div
    e.stopPropagation()
    e.preventDefault()
    // Get pasted data via clipboard API
    const clipboardData = e.clipboardData
    const pastedData = clipboardData.getData('Text')
    if (!textEditor) return
    const range = textEditor.getSelection()
    if (isHTML(pastedData)) {
      const delta = textEditor.clipboard.convert({ html: pastedData })
      textEditor.updateContents(
        new Delta()
          .retain(range ? range.index : 0)
          .delete(range ? range.length : 0)
          .concat(delta)
      )
    }
    if (!isHTML(pastedData)) {
      textEditor.updateContents(
        new Delta()
          .retain(range ? range.index : 0)
          .delete(range ? range.length : 0)
          .insert(pastedData)
      )
    }
  }

  const handleSubmit = async () => {
    onSendMail()
    resetErrorSendMail()
    reset()
    resetEditor()
    navigate(PagePath.MAIL_RESERVATION)
  }

  const handleOpenConfirm = useCallback(() => {
    onSetModalName('confirm-send')
  }, [])

  const handlePreview = async () => {
    const quillContent = textEditor?.root.innerHTML
    if (!quillContent || quillContent.trim() === '<p><br></p>') {
      setErrorContent('本文を入力してください')
      return
    }

    if (!subject || subject.trim() === '') {
      setErrorSubject('件名が未入力です')
      return
    }
    if (signature?.trim() !== '<p><br></p>') {
      setContent(quillContent)
      const editorContent = quillContent + '<br>' + '================================================' + '<br>' + signature
      if (textEditor.root) {
        textEditor.root.innerHTML = editorContent
      }
    }
    setIsConfirm(false)
  }
  const handleCancelPreview = useCallback(() => {
    setIsConfirm(true)
    if (textEditor?.root) {
      textEditor.root.innerHTML = content
    }
  }, [textEditor, content])

  return (
    <>
      <main className={cn('flex flex-col justify-between gap-1 px-4 py-2', 'text__editor')}>
        <div className='flex h-full flex-col gap-2'>
          <p className='font-bold'>
            {/* Content */}
            本文 <span className='text-red-600'>*</span>
          </p>
          {/* <textarea className='h-full rounded-md p-2' onChange={handleChangeContent} value={content} /> */}
          <div className='flex h-full flex-col'>
            {/* <div id='quill' /> */}
            <div id='quill' className={`quill-editor ${deviceType}`} onPasteCapture={handlePaste} />
            {errorContent && <p className='text-red-600'>{errorContent}</p>}
          </div>
        </div>
        {isConfirm ? (
          <div className='flex h-20 flex-col gap-1'>
            {/* Attachments */}
            <p className='font-bold'>添付ファイル</p>
            <FileUpload {...customUploadProps} />
            <div className='flex gap-4 font-medium'>
              {/* File formats */}
              <p>ファイル形式: {fileAccept.join('/')}</p>
              {/* Size */}
              <p>容量: {maxFileSize}mbまで</p>
            </div>
          </div>
        ) : (
          <>
            <div className='flex h-20 flex-col gap-1'>
              {/* Attachments */}
              <p className='font-bold'>添付ファイル</p>
              <Upload
                {...customUploadProps}
                locale={{
                  removeFile: '未設定'
                }}
                showUploadList={{
                  showDownloadIcon: false,
                  showRemoveIcon: true
                }}
              />
              {fileList.length === 0 && <div>未設定</div>}
            </div>
          </>
        )}
      </main>
      {isConfirm ? (
        <>
          <Footer>
            <div className='flex gap-2'>
              {/* Test Sent */}
              <Button onClick={handleOpenSendMailPreview}>テスト送信</Button>
              <ButtonSaveTemplate onSave={handleSaveTemplate} />
            </div>
            <div className='flex gap-2'>
              {/* Save as draft */}
              <Button onClick={handleSaveDraft}>下書き保存</Button>
              {/* Next */}
              <Button type='primary' danger className='bg-[#001529] text-white' onClick={handlePreview}>
                次へ
              </Button>
            </div>
          </Footer>
        </>
      ) : (
        <>
          <Footer>
            <div className='flex gap-2'>
              <Button onClick={handleOpenSendMailPreview}>テスト送信</Button>
            </div>
            <div className='flex gap-2'>
              {/* Next */}
              <Button onClick={handleCancelPreview}>キャンセル</Button>
              <Button type='primary' danger className='bg-[#001529] text-white' onClick={handleOpenConfirm}>
                配信登録
              </Button>
            </div>
          </Footer>
        </>
      )}
      {modalName === 'sendMailPreview' && <SendMailPreviewModal isOpen={modalName === 'sendMailPreview'} onClose={onResetModalName} content={textEditor?.getText().trim() ? textEditor?.getSemanticHTML() : ''} />}
      {modalName === 'confirm-send' && <SaveModal isOpen={modalName === 'confirm-send'} onCancel={onResetModalName} onSubmit={handleSubmit} />}
    </>
  )
}

export default TextEditor
