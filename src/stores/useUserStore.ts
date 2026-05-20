"use client";

import { create } from "zustand";

export type AuthProvider = "google" | "kakao";

interface UserState {
  name: string | null;
  provider: AuthProvider | null;
  setUser: (user: { name: string; provider: AuthProvider }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: null,
  provider: null,
  setUser: ({ name, provider }) => set({ name, provider }),
  clearUser: () => set({ name: null, provider: null }),
}));
