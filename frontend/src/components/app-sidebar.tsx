import { Link, useLocation } from "react-router"
import {
  HomeIcon,
  SearchIcon,
  UserRoundIcon,
  ArrowRightIcon,
  CalendarCheckIcon,
  RotateCcwClockIcon,
  LayoutDashboardIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarMenu,
  SidebarFooter,
  SidebarGroup,
  SidebarContent,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent
} from "@/components/ui/sidebar"

export const navItems = [
  {
    label: "Trang chủ",
    description: "Khám phá và quản lý thư viện của bạn",
    href: "/",
    icon: HomeIcon
  },
  {
    label: "Tìm kiếm sách",
    description: "Tra cứu danh mục sách theo tên, tác giả và thể loại",
    href: "/search",
    icon: SearchIcon
  },
  {
    label: "Đặt trước sách",
    description: "Quản lý các yêu cầu mượn và giữ sách trước",
    href: "/book-reservation",
    icon: CalendarCheckIcon
  },
  {
    label: "Lịch sử mượn",
    description: "Theo dõi các lượt mượn trả và thời hạn sách",
    href: "/borrow-history",
    icon: RotateCcwClockIcon
  },
  {
    label: "Tổng quan",
    description: "Tổng quan hoạt động mượn trả và gợi ý sách dành cho bạn",
    href: "/dashboard",
    icon: LayoutDashboardIcon
  },
  {
    label: "Hồ sơ cá nhân",
    description: "Xem và cập nhật thông tin tài khoản",
    href: "/profile",
    icon: UserRoundIcon
  }
]

export const AppSidebar = (props: React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-0">
        <Link to="/dashboard" className="flex items-center justify-start gap-2.5 px-4 py-2">
          <img src="/logo.png" alt="Logo" className="size-11" />
          <div>
            <h1 className="text-base font-bold text-primary">Thư viện thông minh</h1>
            <p className="text-xs text-muted-foreground">Tri thức mở - Tương lai rộng</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={item.href === location.pathname}
                    className="h-auto py-2.5"
                    render={(buttonProps) => (
                      <Link to={item.href} {...buttonProps}>
                        <item.icon className="shrink-0!" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col items-center rounded-lg bg-blue-50">
          <img src="/images/books.png" alt="Books" className="w-52 object-contain" />
          <div className="px-4 text-center text-lg font-bold">
            <span className="text-blue-600">Đọc sách mỗi ngày</span>
            <br />
            <span className="lg:text-[19px]">Mở ra thế giới mới</span>
          </div>
          <div className="flex flex-col items-center gap-2 px-4 pt-2 pb-4 text-center">
            <p className="text-[13px] text-muted-foreground">
              Hàng ngàn đầu sách đang chờ bạn khám phá!
            </p>
            <Button type="button" onClick={() => {}} className="mt-1 h-10 w-full">
              Khám phá ngay <ArrowRightIcon />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
