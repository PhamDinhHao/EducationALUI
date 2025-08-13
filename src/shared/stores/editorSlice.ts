import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { StateCreator } from 'zustand'

export interface IEditorSlice {
  nameTemplate: string
  content: string
  type: TemplateType
  setContent: (content: string, type?: TemplateType) => void
  setNameTemplate: (name: string) => void
  resetEditor: () => void
}

export const createEditorSlice: StateCreator<IEditorSlice, [], [], IEditorSlice> = (set) => ({
  nameTemplate: '',
  content: '',
  type: TemplateType.TEXT,
  setContent: (content: string, type?: TemplateType) => set({ content, type: type ?? TemplateType.TEXT }),
  setNameTemplate: (name: string) => set({ nameTemplate: name }),
  resetEditor: () =>
    set({
      nameTemplate: '',
      content: '',
      type: TemplateType.TEXT,
    })
})
