import { redirect, type MiddlewareFunction } from "react-router"

import { api } from "@/lib/axios"
import { useAuthStore } from "@/features/auth/stores/use-auth-store"

const ensureSession = async (): Promise<boolean> => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) return true

  try {
    const result = await api.post<{ access_token: string }>("/auth/refresh")
    useAuthStore.getState().setAccessToken(result.access_token)
    return true
  } catch {
    return false
  }
}

export const requireAuth: MiddlewareFunction = async ({ request }) => {
  const isAuthed = await ensureSession()

  if (!isAuthed) {
    const redirectTo = new URL(request.url).pathname
    throw redirect(`/login?redirect=${encodeURIComponent(redirectTo)}`)
  }
}

export const requireGuest: MiddlewareFunction = async () => {
  const isAuthed = await ensureSession()
  if (isAuthed) {
    throw redirect("/")
  }
}
