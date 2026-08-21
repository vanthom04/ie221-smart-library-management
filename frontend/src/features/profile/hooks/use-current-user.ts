import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/axios"
import { useAuthStore } from "@/features/auth/stores/use-auth-store"

import type { User } from "../types"

export const useCurrentUser = () => {
  const { accessToken } = useAuthStore()

  return useQuery<User | null>({
    queryKey: ["current-user"],
    queryFn: async () => {
      return await api.get("/users/me")
    },
    enabled: !!accessToken
  })
}
