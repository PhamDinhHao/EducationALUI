import { create } from 'zustand'

export type Shared = {
  isLoading: boolean
}

type SharedActions = {
  setIsLoading: (isLoading: boolean) => void
}

export const useSharedStore = create<Shared & SharedActions>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading })
}))
