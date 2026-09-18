import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"

import { useAuthStore } from "@/features/auth/stores/use-auth-store"
import { ApiError, type ApiErrorResponse } from "./api-error"

declare module "axios" {
  interface AxiosInstance {
    get<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T>
    post<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T>
    put<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T>
    patch<T = unknown>(url: string, data?: unknown, config?: InternalAxiosRequestConfig): Promise<T>
    delete<T = unknown>(url: string, config?: InternalAxiosRequestConfig): Promise<T>
  }
}

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/change-password"]

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30_000, // 30s
  headers: {
    "Content-Type": "application/json"
  }
})

// Gắn access token vào mỗi request
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use((response) => response.data)

// --- Xử lý refresh token ---
let isRefreshing = false
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (error: unknown) => void }> = []

function subscribeRefresh(resolve: (token: string) => void, reject: (error: unknown) => void) {
  refreshQueue.push({ resolve, reject })
}

function onRefreshed(token: string) {
  refreshQueue.forEach(({ resolve }) => resolve(token))
  refreshQueue = []
}

function onRefreshFailed(error: unknown) {
  refreshQueue.forEach(({ reject }) => reject(error))
  refreshQueue = []
}

function logoutAndRedirect() {
  useAuthStore.getState().logout()
  if (window.location.pathname !== "/login") {
    const returnTo = window.location.pathname + window.location.search
    window.location.assign(`/login?redirect=${encodeURIComponent(returnTo)}`)
  }
}

function isAuthEndpoint(url?: string): boolean {
  return AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint))
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig

    if (error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      logoutAndRedirect()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => subscribeRefresh(resolve, reject)).then(
        (newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      )
    }

    isRefreshing = true

    try {
      const { access_token } = await api.post<{ access_token: string }>("/auth/refresh")
      useAuthStore.getState().setAccessToken(access_token)
      onRefreshed(access_token)
      originalRequest.headers.Authorization = `Bearer ${access_token}`
      return api(originalRequest)
    } catch (refreshError) {
      onRefreshFailed(refreshError)
      logoutAndRedirect()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) {
      return Promise.reject(new ApiError(0, { detail: "Không thể kết nối tới server", errors: [] }))
    }
    return Promise.reject(new ApiError(error.response.status, error.response.data))
  }
)
