import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { DueSoonBook } from "../types"

export function useDueSoonBooks() {
  return useQuery({
    queryKey: ["user-due-soon-books"],
    queryFn: async () => {
      return await api.get<DueSoonBook[]>("/dashboard/user/due-soon-books")
    }
  })
}
