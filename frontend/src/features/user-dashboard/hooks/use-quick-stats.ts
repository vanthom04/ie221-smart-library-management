import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios"
import type { DashboardQuickStat } from "../types";

export function useQuickStats() {
  return useQuery({
    queryKey: ["dashboard-quick-stats"],
    queryFn: async () => {
      const response = await api.get<DashboardQuickStat[]>("/dashboard/user/quick-stats");
      return response;
    },
  });
}
