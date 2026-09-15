import {
  CalendarCheckIcon,
  HomeIcon,
  LayoutDashboardIcon,
  RotateCcwClockIcon,
  SearchIcon,
  UserRoundIcon
} from "lucide-react"

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
