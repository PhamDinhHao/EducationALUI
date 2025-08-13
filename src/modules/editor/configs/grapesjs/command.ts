/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import toast from 'react-hot-toast'
import type { Editor } from 'grapesjs'
import { PagePath } from '@/shared/core/enum/page.enum'
import env from '@/shared/core/constants/env'
import { request } from '@/plugins/axios'
import { getHTML, getPfx } from '@editor/lib/helper'
import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'

export const addEditorCommand = (editor: Editor) => {
  // Commands
  editor.Commands.add('set-device-desktop', {
    run: (editor) => editor.setDevice('Desktop')
  })
  editor.Commands.add('set-device-mobile', {
    run: (editor) => editor.setDevice('Mobile')
  })

  // Save Button
  editor.Commands.add('saveDb', {
    run: async (editor) => {
      // const storedData = await editor.store()
      try {
        const href = document.location.href
        if (href.includes(`${PagePath.HTML_EDITOR}?action=create`)) {
          // Save template to the API
          await request({
            baseURL: `${env.VITE_HOST_API}`,
            url: '/templates',
            data: {
              content: getHTML(editor),
              type: TemplateType.HTML
            }
          })
          toast.success('Template saved successfully')
        }

        if (href.includes(`${PagePath.HTML_EDITOR}?action=edit`)) {
          // Get id from search parameters
          const id = href.split('&')[1].split('=')[1]
          // Edit template to the API
          await request({
            baseURL: `${env.VITE_HOST_API}`,
            url: `/templates/${id}`,
            method: 'PUT',
            data: {
              content: getHTML(editor)
            }
          })
          toast.success('Edit template successfully')
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('Something error')
      }
    }
  })

  // Import Button
  editor.Commands.add('import', {
    containerEl: null as HTMLDivElement | null,
    codeEditorHtml: null as HTMLDivElement | null,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createCodeViewer(): any {
      return editor.CodeManager.createViewer({
        codeName: 'htmlmixed',
        theme: 'hopscotch',
        readOnly: false
      })
    },

    createCodeEditor() {
      const el = document.createElement('div')
      const codeEditor = this.createCodeViewer()

      el.style.flex = '1 0 auto'
      el.style.boxSizing = 'border-box'
      el.className = `${getPfx(editor)}import-code`
      el.appendChild(codeEditor.getElement())

      return { codeEditor, el }
    },

    getCodeContainer(): HTMLDivElement {
      let containerEl = this.containerEl

      if (!containerEl) {
        containerEl = document.createElement('div')
        containerEl.className = `${getPfx(editor)}import-container`
        containerEl.style.display = 'flex'
        containerEl.style.gap = '5px'
        containerEl.style.flexDirection = 'column'
        containerEl.style.justifyContent = 'space-between'
        this.containerEl = containerEl
      }

      return containerEl
    },

    run(editor) {
      const container = this.getCodeContainer()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let { codeEditorHtml } = this as any

      // Init code viewer if not yet instantiated
      if (!codeEditorHtml) {
        const codeViewer = this.createCodeEditor()
        const btnImp = document.createElement('button')
        const btnUploadFile = document.createElement('button')
        codeEditorHtml = codeViewer.codeEditor
        this.codeEditorHtml = codeEditorHtml

        // Init import button
        btnImp.innerHTML = 'Import HTML'
        btnImp.type = 'button'
        btnImp.className = `bg-[#ccc] py-2 text-black`
        btnImp.onclick = () => {
          const code = codeViewer.codeEditor.editor.getValue()
          editor.Components.clear()
          editor.Css.clear()
          editor.setComponents(code)
          editor.Modal.close()
        }

        // Init upload file button
        btnUploadFile.innerHTML = 'Upload File HTML'
        btnUploadFile.type = 'button'
        btnUploadFile.className = `bg-[#fa3f] py-2 text-black`
        btnUploadFile.onclick = () => {
          const fileInput = document.createElement('input')
          fileInput.type = 'file'
          fileInput.accept = '.html'
          fileInput.onchange = (event) => {
            const target = event.target as HTMLInputElement
            const files = target.files as FileList
            const file = files[0]
            const reader = new FileReader()
            reader.onload = (e) => {
              const target = e.target as FileReader
              editor.Components.clear()
              editor.Css.clear()
              if (!target.result) return
              editor.setComponents(target.result)
              editor.Modal.close()
            }
            reader.readAsText(file)
          }
          fileInput.click()
        }

        container.appendChild(codeViewer.el)
        container.appendChild(btnImp)
        container.appendChild(btnUploadFile)
      }

      editor.Modal.open({
        title: 'Import template',
        content: container
      })

      if (codeEditorHtml) {
        codeEditorHtml.setContent('')
        codeEditorHtml.editor.refresh()
      }
    }
  })

  //Clear Button
  editor.Commands.add('cmd-clear', {
    run: (editor) => {
      editor.DomComponents.clear()
      editor.CssComposer.clear()
    }
  })

  //Undo
  editor.Commands.add('undo', {
    run: (editor) => editor.UndoManager.undo()
  })

  // Redo
  editor.Commands.add('redo', {
    run: (editor) => editor.UndoManager.redo()
  })

  editor.Commands.add('export', {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    run: (editor) => editor.runCommand('gjs-export-zip')
  })
  editor.Components.addType('link', {
    model: {
      defaults: {
        traits: [
          {
            type: 'text',
            name: 'href',
            label: 'リンク先URL',
            placeholder: 'https://',
          },
          {
            type: 'text',
            name: 'title',
            label: 'リンクタイトル',
            placeholder: 'リンクタイトル',
          },
          {
            type: 'select',
            name: 'target',
            label: 'リンク先ターゲット',
            options: [
              { value: '_self', name: '同じウィンドウ', id: '_self' },
              { value: '_blank', name: '新しいウィンドウ', id: '_blank' }
            ]
          },
          {
            type: 'select',
            name: 'groupsocial',
            label: 'ソーシャルアイコン',
            options: [
              { value: 'facebook', name: 'Facebook', id: 'facebook' },
              { value: 'youtube', name: 'YouTube', id: 'youtube' },
              { value: 'line', name: 'LINE', id: 'line' },
              { value: 'instagram', name: 'Instagram', id: 'instagram' },
              { value: 'x', name: 'X', id: 'x' },
            ]
          }
        ],
      },
      initialize() {
        const socialIcons = {
          facebook: {
            url: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170300_icon-facebook-basic.png',
            alt: 'Facebook'
          },
          youtube: {
            url: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170304_icon-youtube-basic.png',
            alt: 'YouTube'
          },
          line: {
            url: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170254_icon-line-basic.png',
            alt: 'LINE'
          },
          instagram: {
            url: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170257_icon-instagram-basic.png',
            alt: 'Instagram'
          },
          x: {
            url: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170250_icon-x-basic.png',
            alt: 'X'
          }
        } as const;

        type SocialIconKey = keyof typeof socialIcons;
        // Existing change event handler
        this.on('change:attributes:groupsocial', (model) => {
          const value = model.get('attributes').groupsocial;
         const imgComponent = model.components().models[0];
          if (!value || !(value as SocialIconKey in socialIcons)) return;
          
          const socialValue = value as SocialIconKey;
          if (imgComponent) {
            imgComponent.attributes.src = socialIcons[socialValue].url
            imgComponent.set({
              attributes: {
                ...imgComponent.get('attributes'),
                src: socialIcons[socialValue].url,
                alt: socialIcons[socialValue].alt
              }
            });
          }
          model.set({
            attributes: {
              ...model.get('attributes'),
              title: socialIcons[socialValue].alt
            }
          });
        });
      }
    },
  })
}
