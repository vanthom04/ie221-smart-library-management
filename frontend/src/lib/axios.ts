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

const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh"]

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
let refreshQueue: Array<(token: string) => void> = []

function subscribeRefresh(callback: (token: string) => void) {
  refreshQueue.push(callback)
}

function onRefreshed(token: string) {
  refreshQueue.forEach((callback) => callback(token))
  refreshQueue = []
}

function isAuthEndpoint(url?: string): boolean {
  return AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint))
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isAuthEndpoint(originalRequest.url)) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(api(originalRequest))
        })
      })
    }

    isRefreshing = true

    try {
      const { accessToken } = await api.post<{ accessToken: string }>("/auth/refresh")
      useAuthStore.getState().setAccessToken(accessToken)
      onRefreshed(accessToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      useAuthStore.getState().logout()
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
