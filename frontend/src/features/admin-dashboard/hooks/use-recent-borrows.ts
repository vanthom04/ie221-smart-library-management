import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { AdminRecentBorrow } from "../types"

export function useRecentBorrows() {
  return useQuery({
    queryKey: ["admin-recent-borrows"],
    queryFn: async () => {
      return await api.get<AdminRecentBorrow[]>("/dashboard/admin/recent-borrows")
    }
  })
}
