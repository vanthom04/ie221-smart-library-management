import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { CategoryStat } from "../types"

export type CategoryKey = "lifeSkills" | "economics" | "literature" | "science" | "history"

export function useCategoryStats() {
  return useQuery({
    queryKey: ["admin-category-stats"],
    queryFn: async () => {
      return await api.get<CategoryStat[]>("/dashboard/admin/category-stats")
    }
  })
}
