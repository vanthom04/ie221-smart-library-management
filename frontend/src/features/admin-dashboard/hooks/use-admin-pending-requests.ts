import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { AdminPendingRequest } from "../types"
import { useAnimatedToast } from "@/components/ui/animated-toast"
import { isApiError, type ApiErrorResponse } from "@/lib/api-error"
import type { AxiosError } from "axios"

export function useAdminPendingRequests() {
  return useQuery({
    queryKey: ["admin-pending-requests"],
    queryFn: async () => {
      return await api.get<AdminPendingRequest[]>("/dashboard/admin/pending-requests")
    }
  })
}

export function useApproveRequest() {
  const queryClient = useQueryClient()
  const { addToast } = useAnimatedToast()

  return useMutation({
    mutationFn: async (requestId: string) => {
      return await api.post(`/dashboard/admin/requests/${requestId}/approve`)
    },
    onSuccess: () => {
      const message = "Phê duyệt yêu cầu mượn sách thành công!"
      addToast({ type: "success", message })

      // Làm mới dữ liệu danh sách chờ và thống kê tổng quan
      queryClient.invalidateQueries({ queryKey: ["admin-pending-requests"] })
      queryClient.invalidateQueries({ queryKey: ["admin-quick-stats"] })
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = isApiError(error) ? error.message : "Không thể phê duyệt yêu cầu này."
      addToast({ type: "error", message })
    }
  })
}

export function useRejectRequest() {
  const queryClient = useQueryClient()
  const { addToast } = useAnimatedToast()

  return useMutation({
    mutationFn: async (requestId: string) => {
      return await api.post(`/dashboard/admin/requests/${requestId}/reject`)
    },
    onSuccess: () => {
      const message = "Từ chối yêu cầu mượn sách thành công!"
      addToast({ type: "success", message })

      // Làm mới dữ liệu danh sách chờ và thống kê tổng quan
      queryClient.invalidateQueries({ queryKey: ["admin-pending-requests"] })
      queryClient.invalidateQueries({ queryKey: ["admin-quick-stats"] })
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message = error?.response?.data?.detail || "Không thể từ chối yêu cầu này."
      addToast({ type: "error", message })
    }
  })
}
