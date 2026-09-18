import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { BorrowedBook } from "../types"

export function useBorrowedBooks() {
  return useQuery({
    queryKey: ["user-borrowed-books"],
    queryFn: async () => {
      const response = await api.get<BorrowedBook[]>("/dashboard/user/borrowed-books")
      return response
    }
  })
}
