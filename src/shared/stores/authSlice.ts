import { User } from "@/shared/core/types";
import { StateCreator } from "zustand";

export interface IAuthSlice {
  user: null | User;
  userLogin: (user: User) => void;
  resetProfile: () => void;
  userProfile: (user: User) => void;
}

const USER_STORAGE_KEY = 'user_data';

export const createAuthSlice: StateCreator<IAuthSlice, [], [], IAuthSlice> = (
  set,
) => ({
  user: JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null'),
  userLogin: (user) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    set((_) => ({
      user
    }));
  },
  resetProfile: () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    set((_) => ({
      user: null,
    }));
  },
  userProfile: (user) => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    set(() => ({ user }));
  },
});