import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { AdminPendingRequest } from "../types"

export function useAdminPendingRequests() {
  return useQuery({
    queryKey: ["admin-pending-requests"],
    queryFn: async () => {
      return await api.get<AdminPendingRequest[]>("/dashboard/admin/pending-requests")
    },
  })
}

export function useApproveRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (requestId: string) => {
      return await api.post(`/dashboard/admin/requests/${requestId}/approve`)
    },
    onSuccess: () => {
      // toast.success("Phê duyệt yêu cầu mượn sách thành công!")
      // Làm mới dữ liệu danh sách chờ và thống kê tổng quan
      queryClient.invalidateQueries({ queryKey: ["admin-pending-requests"] })
      queryClient.invalidateQueries({ queryKey: ["admin-quick-stats"] })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || "Không thể phê duyệt yêu cầu này."
      // toast.error(message)
    },
  })
}