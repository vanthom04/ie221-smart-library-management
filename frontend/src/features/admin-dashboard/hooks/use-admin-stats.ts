import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { AdminQuickStat } from "../types"

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-quick-stats"],
    queryFn: async () => {
      return await api.get<AdminQuickStat[]>("/dashboard/admin/stats")
    },
  })
}