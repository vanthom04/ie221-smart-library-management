import { Link } from "react-router"
import {
  ClockIcon,
  WalletIcon,
  BookOpenIcon,
  ArrowRightIcon,
  CalendarCheckIcon
} from "lucide-react"

import { StatCard } from "@/features/home/components/stat-card"
import { HeroBanner } from "@/features/home/components/hero-banner"
import { CategoryCard } from "@/features/home/components/category-card"
import type { CategoryItemType, StatItemType } from "@/features/home/types"

const statsData: StatItemType[] = [
  {
    id: "1",
    title: "Sách đang mượn",
    value: 3,
    actionText: "Xem chi tiết",
    colorClass: "bg-blue-50",
    textColorClass: "text-blue-600",
    icon: <BookOpenIcon className="size-6" />
  },
  {
    id: "2",
    title: "Sách quá hạn",
    value: 1,
    actionText: "Xem chi tiết",
    colorClass: "bg-amber-50",
    textColorClass: "text-amber-500",
    icon: <ClockIcon className="size-6" />
  },
  {
    id: "3",
    title: "Tiền phạt chưa thanh toán",
    value: "25.000đ",
    actionText: "Thanh toán ngay",
    colorClass: "bg-orange-50",
    textColorClass: "text-orange-500",
    icon: <WalletIcon className="size-6" />
  },
  {
    id: "4",
    title: "Đặt trước đang chờ",
    value: 2,
    actionText: "Xem chi tiết",
    colorClass: "bg-green-50",
    textColorClass: "text-green-600",
    icon: <CalendarCheckIcon className="size-6" />
  }
]

const categoriesData: CategoryItemType[] = [
  {
    id: "c1",
    title: "Khoa học tự nhiên",
    colorClass: "bg-emerald-50",
    textColorClass: "text-emerald-600",
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2" />
        <path d="M6.453 15h11.094" />
        <path d="M8.5 2h7" />
      </svg>
    )
  },
  {
    id: "c2",
    title: "Kỹ thuật – Công nghệ",
    colorClass: "bg-blue-50",
    textColorClass: "text-blue-600",
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z" />
        <path d="M20.054 15.987H3.946" />
      </svg>
    )
  },
  {
    id: "c3",
    title: "Kinh tế – Quản trị",
    colorClass: "bg-orange-50",
    textColorClass: "text-orange-500",
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 3v16a2 2 0 0 0 2 2h16" />
        <path d="M18 17V9" />
        <path d="M13 17V5" />
        <path d="M8 17v-3" />
      </svg>
    )
  },
  {
    id: "c4",
    title: "Văn học – Tiểu thuyết",
    colorClass: "bg-purple-50",
    textColorClass: "text-purple-600",
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2v8l3-3 3 3V2" />
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
      </svg>
    )
  },
  {
    id: "c5",
    title: "Tâm lý – Kỹ năng sống",
    colorClass: "bg-pink-50",
    textColorClass: "text-pink-500",
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
      </svg>
    )
  },
  {
    id: "c6",
    title: "Lịch sử – Địa lý",
    colorClass: "bg-teal-50",
    textColorClass: "text-teal-600",
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    )
  },
  {
    id: "c7",
    title: "Sách thiếu nhi",
    colorClass: "bg-amber-50",
    textColorClass: "text-amber-500",
    icon: (
      <svg
        className="h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
        <path d="M15 12h.01" />
        <path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
        <path d="M9 12h.01" />
      </svg>
    )
  }
]

export const HomePage = () => {
  return (
    <div className="flex flex-col gap-8">
      <HeroBanner />

      {/* Thống kê nhanh */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </section>

      {/* Danh mục nổi bật */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Danh mục nổi bật</h2>
          <Link
            to="#"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline hover:underline-offset-2 [&_svg]:size-4"
          >
            Xem tất cả <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {categoriesData.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
    </div>
  )
}
