import { createBrowserRouter } from "react-router"

import { FallbackLoader } from "@/components/fallback-loader"
import { RootErrorBoundary } from "@/components/root-error-boundary"

import { loadSession, requireAuth, requireGuest } from "./middleware"

export const router = createBrowserRouter([
  {
    middleware: [requireGuest],
    HydrateFallback: FallbackLoader,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        path: "/login",
        lazy: () => import("@/pages/auth/login").then((m) => ({ Component: m.LoginPage }))
      },
      {
        path: "/register",
        lazy: () => import("@/pages/auth/register").then((m) => ({ Component: m.RegisterPage }))
      }
    ]
  },
  {
    path: "/",
    middleware: [loadSession],
    HydrateFallback: FallbackLoader,
    ErrorBoundary: RootErrorBoundary,
    lazy: () => import("@/layouts/main-layout").then((m) => ({ Component: m.MainLayout })),
    children: [
      {
        path: "/",
        lazy: () => import("@/pages/user/home").then((m) => ({ Component: m.HomePage }))
      },
      {
        path: "/search",
        lazy: () => import("@/pages/user/search").then((m) => ({ Component: m.SearchPage }))
      },
      {
        path: "/book-reservation",
        middleware: [requireAuth],
        HydrateFallback: FallbackLoader,
        lazy: () =>
          import("@/pages/user/book-reservation").then((m) => ({
            Component: m.BookReservationPage
          }))
      },
      {
        path: "/borrow-history",
        middleware: [requireAuth],
        HydrateFallback: FallbackLoader,
        lazy: () =>
          import("@/pages/user/borrow-history").then((m) => ({ Component: m.BorrowHistoryPage }))
      },
      {
        path: "/dashboard",
        middleware: [requireAuth],
        HydrateFallback: FallbackLoader,
        lazy: () => import("@/pages/user/dashboard").then((m) => ({ Component: m.DashboardPage }))
      },
      {
        path: "/profile",
        middleware: [requireAuth],
        HydrateFallback: FallbackLoader,
        lazy: () => import("@/pages/user/profile").then((m) => ({ Component: m.ProfilePage }))
      }
    ]
  }
])
