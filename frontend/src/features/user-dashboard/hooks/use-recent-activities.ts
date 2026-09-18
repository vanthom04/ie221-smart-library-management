import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { ActivityItem } from "../types"

export function useRecentActivities() {
  return useQuery({
    queryKey: ["user-recent-activities"],
    queryFn: async () => {
      return await api.get<ActivityItem[]>("/dashboard/user/recent-activities")
    }
  })
}
