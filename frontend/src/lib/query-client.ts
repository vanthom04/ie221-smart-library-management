import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 phút coi là fresh
      gcTime: 5 * 60 * 1000, // giữ cache 5 phút sau khi unmount
      retry: (failureCount, error) => {
        // Không retry lỗi 401/403 — để interceptor axios lo refresh
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status === 401 || status === 403) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: false
    }
  }
})
