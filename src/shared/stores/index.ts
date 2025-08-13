import { createAuthSlice, IAuthSlice } from '@/shared/stores/authSlice'
import { createEditorSlice, IEditorSlice } from '@/shared/stores/editorSlice'
import { IInfoSendMail } from '@/shared/stores/infoSendMailSlice'
import { createInfoSendmailSlice } from '@/shared/stores/infoSendMailSlice'
import { createLoadingSlice, ILoadingSlice } from '@/shared/stores/loadingSlice'
import { create } from 'zustand'

export type CommonState = IAuthSlice & ILoadingSlice & IInfoSendMail & IEditorSlice

export const useBoundStore = create<CommonState>((...a) => ({
  ...createAuthSlice(...a),
  ...createLoadingSlice(...a),
  ...createInfoSendmailSlice(...a),
  ...createEditorSlice(...a),
}))
