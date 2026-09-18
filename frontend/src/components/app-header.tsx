import { useQueryClient } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "react-router"
import {
  ChevronDownIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ShieldIcon,
  User2Icon
} from "lucide-react"

import { useAuthStore } from "@/features/auth/stores/use-auth-store"
import { useCurrentUser } from "@/features/profile/hooks/use-current-user"

import { api } from "@/lib/axios"
import { getInitials } from "@/lib/utils"
import { isApiError } from "@/lib/api-error"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAnimatedToast } from "@/components/ui/animated-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { navItems } from "./app-sidebar-nav"

export const AppHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()
  const { addToast } = useAnimatedToast()
  const { data: user, isPending } = useCurrentUser()

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")

      logout()
      queryClient.clear()
      navigate("/login", { replace: true })
    } catch (error) {
      const message = isApiError(error) ? error.message : "Có lỗi xảy ra vui lòng thử lại sau!"
      addToast({ type: "error", message })
    }
  }

  const currentPage = navItems.find((item) => item.href === location.pathname)

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-2.5">
      <div className="flex flex-1 flex-col">
        <h3 className="text-base font-semibold">{currentPage?.label ?? "Thư viện"}</h3>
        {currentPage?.description && (
          <p className="text-[13px] text-muted-foreground">{currentPage.description}</p>
        )}
      </div>

      <div className="flex items-center justify-center gap-6">
        {user ? (
          <>
            {isPending ? (
              <Skeleton className="h-11 w-56" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={(buttonProps) => (
                    <Button variant="ghost" className="h-auto py-1" {...buttonProps}>
                      <Avatar className="size-8.5">
                        <AvatarImage src={user?.avatar_url ?? ""} alt={user?.full_name} />
                        <AvatarFallback>{getInitials(user?.full_name ?? "User")}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium text-foreground">{user?.full_name}</div>
                        <div className="text-xs text-muted-foreground">{user?.email}</div>
                      </div>
                      <ChevronDownIcon />
                    </Button>
                  )}
                />
                <DropdownMenuContent sideOffset={10}>
                  {user?.role === "admin" && (
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      <ShieldIcon />
                      <span>Trang quản trị</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User2Icon />
                    <span>Cá nhân</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboardIcon />
                    <span>Tổng quan</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/borrow-history")}>
                    <HistoryIcon />
                    <span>Lịch sử mượn</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOutIcon />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </>
        ) : (
          <Button
            nativeButton={false}
            className="h-auto bg-blue-500 px-4 py-2.5"
            render={(buttonProps) => (
              <Link to="/login" {...buttonProps}>
                Đăng nhập
              </Link>
            )}
          />
        )}
      </div>
    </header>
  )
}
