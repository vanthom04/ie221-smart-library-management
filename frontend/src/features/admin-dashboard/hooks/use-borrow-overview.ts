import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { BorrowOverviewData } from "../types"

export function useBorrowOverview(period: string) {
  return useQuery({
    queryKey: ["user-borrow-overview", period],
    queryFn: async () => {
      return await api.get<BorrowOverviewData>(`/dashboard/admin/borrow-overview?period=${period}`)
    }
  })
}
