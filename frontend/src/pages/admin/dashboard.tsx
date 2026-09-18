import { useState } from "react"

import { BorrowOverviewCard } from "@/features/admin-dashboard/components/borrow-overview-card"
import { CategoryStatsCard } from "@/features/admin-dashboard/components/category-stats-card"
import { AdminStatCards } from "@/features/admin-dashboard/components/admin-stat-cards"

import { useAdminStats } from "@/features/admin-dashboard/hooks/use-admin-stats"
import { useRecentBorrows } from "@/features/admin-dashboard/hooks/use-recent-borrows"
import { RecentBorrowsTable } from "@/features/admin-dashboard/components/recent-borrows-table"
import { useCategoryStats } from "@/features/admin-dashboard/hooks/use-category-stats"
import { useBorrowOverview } from "@/features/admin-dashboard/hooks/use-borrow-overview"

export const AdminDashboardPage = () => {
  const [period, setPeriod] = useState<string>("3m")

  const { data: borrowData } = useBorrowOverview(period)

  const { data: adminStats } = useAdminStats()
  const { data: borrows } = useRecentBorrows()
  const { data: categoryStats } = useCategoryStats()
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Thanh tiêu đề & Nút hành động nhanh */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trang Quản trị Thư viện</h1>
          <p className="text-sm text-muted-foreground">Thống kê tổng quan hoạt động thư viện.</p>
        </div>
      </div>

      {/* Thẻ chỉ số tổng quan */}
      <AdminStatCards stats={adminStats ?? []} />

      {/* Lưới nội dung quản lý */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentBorrowsTable borrows={borrows ?? []} />

        <BorrowOverviewCard
          period={period}
          onPeriodChange={(newPeriod) => setPeriod(newPeriod)}
          data={borrowData?.trend || []}
          stats={borrowData?.stats || []}
        />

        <CategoryStatsCard data={categoryStats ?? []} />
      </div>
    </div>
  )
}
