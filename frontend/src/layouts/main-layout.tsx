import { Link, Outlet } from "react-router"

import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen flex-1">
        <AppSidebar collapsible="icon" />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader />
          <SidebarInset className="h-full overflow-y-auto px-6 py-4">
            <Outlet />
            <footer className="mt-auto flex items-center justify-between pt-8 pb-2">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Thư viện thông minh. All rights reserved.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Link
                  to="#"
                  className="hover:text-foreground hover:underline hover:underline-offset-4"
                >
                  Điều khoản
                </Link>
                <Link
                  to="#"
                  className="hover:text-foreground hover:underline hover:underline-offset-4"
                >
                  Chính sách bảo mật
                </Link>
                <Link
                  to="#"
                  className="hover:text-foreground hover:underline hover:underline-offset-4"
                >
                  Hỗ trợ
                </Link>
              </div>
            </footer>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
