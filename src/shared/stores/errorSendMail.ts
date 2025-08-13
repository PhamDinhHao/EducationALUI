import { create } from 'zustand'

export type ErrorSendMail = {
  errorContent: string
  isConfirm: boolean
  errorSubject: string
}

type ErrorSendMailActions = {
  setErrorContent: (errorContent: string) => void
  setErrorSubject: (errorSubject: string) => void
  setIsConfirm: (isConfirm: boolean) => void
  resetErrorSendMail: () => void
}

export const useErrorSendMailStore = create<ErrorSendMail & ErrorSendMailActions>((set) => ({
  errorContent: '',
  isConfirm: true,
  errorSubject: '',
  setErrorContent: (errorContent: string) => set({ errorContent }),
  setIsConfirm: (isConfirm: boolean) => set({ isConfirm }),
  setErrorSubject: (errorSubject: string) => set({ errorSubject }),
  resetErrorSendMail: () => 
    set({
      errorContent: '',
      isConfirm: true,
      errorSubject: '',
    }),
}))
