import { createBrowserRouter } from "react-router"

import { FallbackLoader } from "@/components/fallback-loader"
import { RootErrorBoundary } from "@/components/root-error-boundary"

import { loadSession, requireAuth, requireAdmin, requireGuest } from "./middleware"

export const router = createBrowserRouter([
  {
    middleware: [requireGuest],
    HydrateFallback: FallbackLoader,
    ErrorBoundary: RootErrorBoundary,
    children: [
      {
        path: "login",
        lazy: () => import("@/pages/auth/login").then((m) => ({ Component: m.LoginPage }))
      },
      {
        path: "register",
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
        index: true,
        lazy: () => import("@/pages/user/home").then((m) => ({ Component: m.HomePage }))
      },
      {
        path: "books",
        lazy: () => import("@/pages/BookList").then((m) => ({ Component: m.default }))
      },
      {
        path: "search",
        lazy: () => import("@/pages/user/search").then((m) => ({ Component: m.SearchPage }))
      },
      {
        path: "books/:id",
        lazy: () =>
          import("@/pages/user/book-detail").then((m) => ({ Component: m.BookDetailPage }))
      },
      {
        path: "book-reservation",
        middleware: [requireAuth],
        HydrateFallback: FallbackLoader,
        lazy: () =>
          import("@/pages/user/book-reservation").then((m) => ({
            Component: m.BookReservationPage
          }))
      },
      {
        path: "borrow-history",
        middleware: [requireAuth],
        HydrateFallback: FallbackLoader,
        lazy: () =>
          import("@/pages/user/borrow-history").then((m) => ({ Component: m.BorrowHistoryPage }))
      },
      {
        path: "dashboard",
        middleware: [requireAuth],
        HydrateFallback: FallbackLoader,
        lazy: () => import("@/pages/user/dashboard").then((m) => ({ Component: m.DashboardPage }))
      },
      {
        path: "profile",
        middleware: [requireAuth],
        HydrateFallback: FallbackLoader,
        lazy: () => import("@/pages/user/profile").then((m) => ({ Component: m.ProfilePage }))
      },
      {
        path: "/admin/dashboard",
        middleware: [requireAdmin],
        HydrateFallback: FallbackLoader,
        lazy: () =>
          import("@/pages/admin/dashboard").then((m) => ({ Component: m.AdminDashboardPage }))
      }
    ]
  },
  {
    path: "/admin",
    middleware: [requireAdmin],
    HydrateFallback: FallbackLoader,
    ErrorBoundary: RootErrorBoundary,
    lazy: () => import("@/pages/admin/AdminLayout").then((m) => ({ Component: m.default })),
    children: [
      {
        index: true,
        lazy: () => import("@/pages/admin/CategoryAdmin").then((m) => ({ Component: m.default }))
      },
      {
        path: "authors",
        lazy: () => import("@/pages/admin/AuthorAdmin").then((m) => ({ Component: m.default }))
      },
      {
        path: "publishers",
        lazy: () => import("@/pages/admin/PublisherAdmin").then((m) => ({ Component: m.default }))
      },
      {
        path: "books",
        lazy: () => import("@/pages/admin/BookAdmin").then((m) => ({ Component: m.default }))
      },
      {
        path: "reservations",
        lazy: () => import("@/pages/admin/ReservationAdmin").then((m) => ({ Component: m.default }))
      },
      {
        path: "borrows",
        lazy: () => import("@/pages/admin/BorrowAdmin").then((m) => ({ Component: m.default }))
      }
    ]
  }
])
