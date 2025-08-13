import { Button } from 'antd'

// - styles
import 'grapesjs/dist/css/grapes.min.css'
import './HtmlEditor.style.scss'

// - hooks
import { useHtmlEditor } from '@editor/hooks'

// - components
import TopNav from '@editor/components/TopNav'
import Sidebar from '@editor/components/Sidebar'
import { Footer } from '@editor/components/layout'
import { ButtonSaveTemplateHtml } from '@editor/components/ui'
import { useErrorSendMailStore } from '@/shared/stores/errorSendMail'
import { getHTML } from '@/modules/editor/lib/helper'
import { useBoundStore } from '@/shared/stores'
import SaveModal from '@/modules/editor/components/SaveModal'
import useHandleModal from '@/shared/hooks/useHandleModal'
import { useCallback } from 'react'
import { PagePath } from '@/shared/core/enum/page.enum'
import { useNavigate } from 'react-router-dom'
import SendMailPreviewModal from '@/modules/editor/components/modals/SendMailPreviewModal'

const HtmlEditor: React.FC = () => {
  const navigate = useNavigate()
  const { modalName, onResetModalName, onSetModalName } = useHandleModal()
  const { editor, handleSaveDraft, onSendMail, temporaryContent, setTemporaryContent } = useHtmlEditor()
  const { isConfirm, setErrorContent, setErrorSubject, setIsConfirm, resetErrorSendMail } = useErrorSendMailStore()
  const { signature, subject, reset, resetEditor } = useBoundStore()

  const handlePreview = async () => {
    const quillContent = editor ? getHTML(editor) : ''
    if (!quillContent || quillContent.trim() === '<html><head><style></style></head></html>') {
      setErrorContent('本文を入力してください')
      return
    }

    if (!subject || subject.trim() === '') {
      setErrorSubject('件名が未入力です')
      return
    }
    if (editor) {
      setTemporaryContent(getHTML(editor))
    }
    if (signature?.trim() !== '<p><br></p>') {
      const editorContent = quillContent + '<br>' + '================================================' + '<br>' + signature
      editor?.setComponents(editorContent)
    }

    setIsConfirm(false)
  }

  const handleSubmit = async () => {
    await onSendMail().then(() => {
      reset()
      resetEditor()
      resetErrorSendMail()
      onResetModalName()
      navigate(PagePath.MAIL_RESERVATION)
    })
  }

  const handleOpenConfirm = useCallback(() => {
    onSetModalName('confirm-send')
  }, [])

  const handleOpenSendMailPreview = useCallback(() => {
    onSetModalName('sendMailPreview')
  }, [])

  const handleCancelPreview = useCallback(() => {
    setIsConfirm(true)
    if (editor?.setComponents) {
      editor.setComponents(temporaryContent)
    }
  }, [editor, temporaryContent])
  return (
    <>
      <main className='flex w-full'>
        <div className='w-[300px] overflow-y-scroll' id='navbar'>
          <Sidebar />
        </div>
        <div className='w-full' id='main-content'>
          <TopNav />
          <div className='px-2 py-1' id='gjs' />
        </div>
      </main>
      {isConfirm ? (
        <Footer>
          <div className='flex gap-2'>
          {/* Test Sent */}
          <Button onClick={handleOpenSendMailPreview}>テスト送信</Button>
          {editor ? <ButtonSaveTemplateHtml editor={editor} /> : null}
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
      ) : (
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
      )}
      {modalName === 'sendMailPreview' && <SendMailPreviewModal isOpen={modalName === 'sendMailPreview'} onClose={onResetModalName} content={editor ? getHTML(editor) : ''} />}
      {modalName === 'confirm-send' && <SaveModal isOpen={modalName === 'confirm-send'} onCancel={onResetModalName} onSubmit={handleSubmit} />}
    </>
  )
}

export default HtmlEditor
