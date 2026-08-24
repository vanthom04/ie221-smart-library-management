import { useState } from "react"

import { DueSoonCard } from "@/features/user-dashboard/components/due-soon-card"
import { CategoryStatsCard } from "@/features/user-dashboard/components/category-stats-card"
import { BorrowedBooksCard } from "@/features/user-dashboard/components/borrowed-books-card"
import { BorrowOverviewCard } from "@/features/user-dashboard/components/borrow-overview-card"
import { SuggestedBooksCard } from "@/features/user-dashboard/components/suggested-books-card"
import { DashboardQuickStats } from "@/features/user-dashboard/components/dashboard-quick-stats"
import { RecentActivitiesCard } from "@/features/user-dashboard/components/recent-activities-card"
import { DashboardReminderCard } from "@/features/user-dashboard/components/dashboard-reminder-card"
import { DashboardWelcomeBanner } from "@/features/user-dashboard/components/dashboard-welcome-banner"
import {
  MOCK_BORROW_SUMMARY_STATS,
  MOCK_BORROW_TREND,
  MOCK_BORROWED_BOOKS,
  MOCK_CATEGORY_STATS,
  MOCK_DUE_SOON_BOOKS,
  MOCK_QUICK_STATS,
  MOCK_RECENT_ACTIVITIES,
  MOCK_SUGGESTED_BOOKS
} from "@/features/user-dashboard/mock-data"

export const DashboardPage = () => {
  const [period, setPeriod] = useState("6m")

  const handleRenewBook = (_bookId: string) => {
    // Sẽ kết nối với API gia hạn sách mượn
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
      {/* Cột nội dung chính */}
      <div className="flex flex-col gap-6">
        <DashboardWelcomeBanner
          userName="Nguyễn Văn An"
          subtitle="Hôm nay là một ngày tuyệt vời để học hỏi và khám phá tri thức mới."
        />

        <DashboardQuickStats stats={MOCK_QUICK_STATS} />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BorrowOverviewCard
            period={period}
            onPeriodChange={setPeriod}
            data={MOCK_BORROW_TREND}
            stats={MOCK_BORROW_SUMMARY_STATS}
          />
          <BorrowedBooksCard books={MOCK_BORROWED_BOOKS} onRenew={handleRenewBook} />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryStatsCard data={MOCK_CATEGORY_STATS} />
          <RecentActivitiesCard activities={MOCK_RECENT_ACTIVITIES} />
        </section>
      </div>

      {/* Cột Sidebar bên phải */}
      <aside className="flex flex-col gap-6">
        <SuggestedBooksCard books={MOCK_SUGGESTED_BOOKS} />
        <DueSoonCard books={MOCK_DUE_SOON_BOOKS} />
        <DashboardReminderCard />
      </aside>
    </div>
  )
}
