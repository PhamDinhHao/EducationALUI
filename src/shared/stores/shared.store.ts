import { create } from 'zustand'

export type Shared = {
  isLoading: boolean
  openKeys: string[]
}

type SharedActions = {
  setIsLoading: (isLoading: boolean) => void
  setOpenKeys: (openKeys: string[]) => void
}

export const useSharedStore = create<Shared & SharedActions>((set) => ({
  isLoading: false,
  openKeys: [],
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setOpenKeys: (openKeys: string[]) => set({ openKeys })
}))
