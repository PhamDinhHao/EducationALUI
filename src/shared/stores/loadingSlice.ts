import { StateCreator } from "zustand";

export interface ILoadingSlice {
  isLoading: boolean;
  setStatusLoading: (status: boolean) => void;
  countRequest: number;
  incrementCountRequest: () => void;
  decrementCountRequest: () => void;
  resetCountRequest: () => void;
}

export const createLoadingSlice: StateCreator<
  ILoadingSlice,
  [],
  [],
  ILoadingSlice
> = (set) => ({
  isLoading: false,
  countRequest: 0,
  setStatusLoading: (isLoading) => set(() => ({ isLoading })),
  incrementCountRequest: () =>
    set((state) => ({ countRequest: state.countRequest + 1 })),
  decrementCountRequest: () =>
    set((state) => ({ countRequest: state.countRequest - 1 })),
  resetCountRequest: () => set(() => ({ countRequest: 0 })),
});
