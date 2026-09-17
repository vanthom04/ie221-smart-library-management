import { useState } from "react"

import { BorrowOverviewCard } from "@/features/admin-dashboard/components/borrow-overview-card"
import { CategoryStatsCard } from "@/features/admin-dashboard/components/category-stats-card"
import { AdminStatCards } from "@/features/admin-dashboard/components/admin-stat-cards"
import { PendingRequestsCard } from "@/features/admin-dashboard/components/pending-requests-card"

import { useAdminStats } from "@/features/admin-dashboard/hooks/use-admin-stats"
import { useAdminPendingRequests, useApproveRequest, useRejectRequest } from "@/features/admin-dashboard/hooks/use-admin-pending-requests"
import { useRecentBorrows } from "@/features/admin-dashboard/hooks/use-recent-borrows"
import { RecentBorrowsTable } from "@/features/admin-dashboard/components/recent-borrows-table"
import { useCategoryStats } from "@/features/admin-dashboard/hooks/use-category-stats"
import { useBorrowOverview } from "@/features/admin-dashboard/hooks/use-borrow-overview"


export const AdminDashboardPage = () => {
  const [period, setPeriod] = useState<string>("3m")
  
  const { data: borrowData} = useBorrowOverview(period)


  const { data: adminStats } = useAdminStats();
  const { data: requests } = useAdminPendingRequests()
  const { data: borrows } = useRecentBorrows()
  const { data: categoryStats } = useCategoryStats()
  const approveMutation = useApproveRequest()
  const rejectMutation = useRejectRequest()
  
  const handleApprove = (id: string) => {
    approveMutation.mutate(id)
  }

  const handleReject = (id: string) => {
    rejectMutation.mutate(id)
  }


  return (
    
    <div className="flex flex-col gap-8 p-6">
      {/* Thanh tiêu đề & Nút hành động nhanh */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trang Quản trị Thư viện</h1>
          <p className="text-sm text-muted-foreground">
            Thống kê tổng quan và duyệt các yêu cầu mượn/trả sách từ độc giả.
          </p>
        </div>
      </div>

      {/* Thẻ chỉ số tổng quan */}
      <AdminStatCards stats={adminStats ?? []} />

      {/* Lưới nội dung quản lý */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PendingRequestsCard
          requests={requests ?? []}
          onApprove={handleApprove}
          onReject={handleReject}
        />

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