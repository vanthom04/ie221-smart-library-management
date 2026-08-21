import { create } from "zustand"

import type { User } from "@/features/profile/types"

interface AuthStore {
  accessToken: string | null
  user: User | null
  setAccessToken: (accessToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  user: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ accessToken: null, user: null })
}))
