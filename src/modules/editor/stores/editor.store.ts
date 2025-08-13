import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Editor = {
  nameTemplate: string
  content: string
  type: TemplateType
}

type EditorActions = {
  setContent: (content: string, type?: TemplateType) => void
  setNameTemplate: (name: string) => void
}

export const useEditorStore = create<Editor & EditorActions>()(
  persist(
    (set) => ({
      nameTemplate: '',
      content: '',
      type: TemplateType.TEXT,
      setContent: (content: string, type?: TemplateType) => set({ content, type: type ?? TemplateType.TEXT }),
      setNameTemplate: (name: string) => set({ nameTemplate: name })
    }),
    {
      name: 'editor'
    }
  )
)
