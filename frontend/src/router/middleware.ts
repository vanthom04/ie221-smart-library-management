import { redirect, type MiddlewareFunction } from "react-router"

import { api } from "@/lib/axios"
import { useAuthStore } from "@/features/auth/stores/use-auth-store"
import type { User } from "@/features/profile/types"
let userPromise: Promise<User | null> | null = null

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

const getCurrentUser = async (): Promise<User | null> => {
  const { user } = useAuthStore.getState()
  if (user) return user

  if (!userPromise) {
    userPromise = api
      .get<User>("/users/me")
      .then((res) => res)
      .catch(() => null)
      .finally(() => {
        userPromise = null
      })
  }

  const fetchedUser = await userPromise
  return fetchedUser
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

export const loadSession: MiddlewareFunction = async () => {
  await ensureSession()
}

export const requireAdmin: MiddlewareFunction = async () => {
  const isAuthed = await ensureSession()

  if (!isAuthed) {
    throw redirect(`/login`)
  }

  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    throw redirect("/")
  }
}
