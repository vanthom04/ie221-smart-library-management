import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { useAuthStore } from "@/features/auth/stores/use-auth-store"
import type { DashboardQuickStat } from "../types"

export function useQuickStats(enabled: boolean = true) {
  const accessToken = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: ["dashboard-quick-stats"],
    queryFn: async () => {
      const response = await api.get<DashboardQuickStat[]>("/dashboard/user/quick-stats")
      return response
    },
    enabled: enabled && !!accessToken
  })
}
