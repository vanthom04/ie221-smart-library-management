import { useState } from "react"
import { CheckIcon, XIcon, ShieldAlertIcon, PlusIcon } from "lucide-react"

import { BorrowOverviewCard } from "@/features/admin-dashboard/components/borrow-overview-card"
import { CategoryStatsCard } from "@/features/admin-dashboard/components/category-stats-card"
import { Button } from "@/components/ui/button"
import { AdminStatCards } from "@/features/admin-dashboard/components/admin-stat-cards"

import {
  MOCK_ADMIN_STATS,
  MOCK_PENDING_REQUESTS,
  MOCK_RECENT_BORROWS,
  MOCK_BORROW_SUMMARY_STATS,
  MOCK_BORROW_TREND,
  MOCK_CATEGORY_STATS
} from "@/features/admin-dashboard/mock-data"


export const AdminDashboardPage = () => {
  const [period, setPeriod] = useState("6m")
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
      <AdminStatCards stats={MOCK_ADMIN_STATS} />

      {/* Lưới nội dung quản lý */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Khối 1: Yêu cầu chờ phê duyệt */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Yêu cầu chờ phê duyệt</h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {MOCK_PENDING_REQUESTS.length} cần xử lý
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {MOCK_PENDING_REQUESTS.map((req) => (
              <div
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 p-3.5 hover:bg-accent/40"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{req.userName}</span>
                    <span className="text-xs text-muted-foreground">({req.userCode})</span>
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">{req.bookTitle}</p>
                  <p className="text-[11px] text-muted-foreground">Ngày tạo: {req.requestDate}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 border-emerald-500 text-emerald-600 hover:bg-emerald-50">
                    <CheckIcon className="mr-1 size-3.5" /> Duyệt
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 border-rose-500 text-rose-600 hover:bg-rose-50">
                    <XIcon className="mr-1 size-3.5" /> Từ chối
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Khối 2: Lượt mượn gần đây */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Nhật ký mượn/trả gần đây</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="p-2.5">Độc giả</th>
                  <th className="p-2.5">Tên sách</th>
                  <th className="p-2.5">Hạn trả</th>
                  <th className="p-2.5 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {MOCK_RECENT_BORROWS.map((item) => (
                  <tr key={item.id} className="hover:bg-accent/30">
                    <td className="p-2.5 font-medium">{item.userName}</td>
                    <td className="p-2.5 line-clamp-1 max-w-[180px]">{item.bookTitle}</td>
                    <td className="p-2.5">{item.dueDate}</td>
                    <td className="p-2.5 text-right">
                      {item.status === "borrowing" && (
                        <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[11px] text-blue-700">
                          Đang mượn
                        </span>
                      )}
                      {item.status === "overdue" && (
                        <span className="inline-block rounded-md bg-rose-100 px-2 py-0.5 text-[11px] text-rose-700 font-semibold">
                          Quá hạn
                        </span>
                      )}
                      {item.status === "returned" && (
                        <span className="inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] text-emerald-700">
                          Đã trả
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <BorrowOverviewCard
                    period={period}
                    onPeriodChange={setPeriod}
                    data={MOCK_BORROW_TREND}
                    stats={MOCK_BORROW_SUMMARY_STATS}
                  />

        <CategoryStatsCard data={MOCK_CATEGORY_STATS} />

      </div>
    </div>
  )
}