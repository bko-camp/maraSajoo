"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { SajuFormPayload } from "@/types/saju";

interface SajuPendingState {
  pending: SajuFormPayload | null;
  setPending: (payload: SajuFormPayload) => void;
  clearPending: () => void;
}

export const useSajuPendingStore = create<SajuPendingState>()(
  persist(
    (set) => ({
      pending: null,
      setPending: (payload) => set({ pending: payload }),
      clearPending: () => set({ pending: null }),
    }),
    {
      name: "mara-saju-pending",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
