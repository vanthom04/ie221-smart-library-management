import { useState } from "react"
import {
  AlertCircleIcon,
  BookCheckIcon,
  CalendarIcon,
  CheckCircle2Icon,
  FilterIcon,
  Loader2Icon
} from "lucide-react"

import { useAnimatedToast } from "@/components/ui/animated-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAdminBorrowRecords, useReturnBorrow } from "@/features/admin-borrowing/hooks"
import type { BorrowRecord, BorrowStatus } from "@/features/admin-borrowing/types"
import { isApiError } from "@/lib/api-error"

const STATUS_CONFIG: Record<BorrowStatus, { label: string; className: string }> = {
  borrowing: { label: "Đang mượn", className: "bg-blue-100 text-blue-800 border-blue-300" },
  returned: { label: "Đã trả", className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  overdue: { label: "Quá hạn", className: "bg-red-100 text-red-800 border-red-300" }
}

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value)
      )
    : "—"

export const BorrowAdminPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<BorrowStatus | "all">("all")

  const { data: records = [], isLoading, error } = useAdminBorrowRecords()
  const returnMutation = useReturnBorrow()
  const { addToast } = useAnimatedToast()

  const filteredRecords =
    selectedStatus === "all" ? records : records.filter((rec) => rec.status === selectedStatus)

  const handleReturn = async (record: BorrowRecord) => {
    try {
      await returnMutation.mutateAsync(record.id)
      addToast({
        type: "success",
        title: "Trả sách thành công",
        message: `Đã xác nhận trả sách cho phiếu mượn #${record.id.slice(0, 8)}.`
      })
    } catch (err) {
      addToast({
        type: "error",
        title: "Không thể xác nhận trả sách",
        message: isApiError(err) ? err.message : "Đã có lỗi xảy ra. Vui lòng thử lại sau."
      })
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📖 Quản lý Mượn & Trả sách</h2>
          <p className="mt-1 text-sm text-gray-500">
            Theo dõi phiếu mượn sách của độc giả, tình trạng hạn trả và xác nhận trả sách.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FilterIcon className="size-4 text-gray-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as BorrowStatus | "all")}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="borrowing">Đang mượn (Borrowing)</option>
            <option value="overdue">Quá hạn (Overdue)</option>
            <option value="returned">Đã trả (Returned)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircleIcon className="size-5" />
          <span>Lỗi khi tải danh sách phiếu mượn. Vui lòng thử lại sau.</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="border p-3 text-left">Mã & Ngày mượn</th>
              <th className="border p-3 text-left">Độc giả</th>
              <th className="border p-3 text-left">Sách mượn</th>
              <th className="border p-3 text-left">Hạn trả</th>
              <th className="border p-3 text-left">Ngày trả</th>
               <th className="border p-3 text-center">Trạng thái</th>
              <th className="border p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2Icon className="size-5 animate-spin text-blue-600" />
                    <span>Đang tải danh sách phiếu mượn...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Chưa có phiếu mượn nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => {
                const config = STATUS_CONFIG[record.status] || {
                  label: record.status,
                  className: "bg-gray-100 text-gray-700"
                }
                const isReturnPending =
                  returnMutation.isPending && returnMutation.variables === record.id
                const canReturn = record.status === "borrowing" || record.status === "overdue"

                return (
                  <tr key={record.id} className="transition-colors hover:bg-gray-50">
                    <td className="border p-3 align-top">
                      <div className="font-mono text-xs font-medium text-gray-900">
                        #{record.id.slice(0, 8)}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <CalendarIcon className="size-3" />
                        <span>{formatDate(record.borrow_date)}</span>
                      </div>
                    </td>

                    <td className="border p-3 align-top">
                      <span className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                        {record.user_id.slice(0, 8)}...
                      </span>
                    </td>

                    <td className="border p-3 align-top">
                      <ul className="space-y-1">
                        {record.items.map((item) => (
                          <li key={item.id} className="text-gray-800">
                            <span className="font-medium">{item.title}</span>{" "}
                            <span className="text-xs text-gray-500">
                              (x{item.quantity} - ISBN: {item.isbn})
                            </span>
                            {item.returned && (
                              <span className="ml-1 text-xs font-medium text-emerald-600">
                                [Đã trả]
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="border p-3 align-top text-gray-700">
                      {formatDate(record.due_date)}
                    </td>

                    <td className="border p-3 align-top text-gray-600">
                      {formatDate(record.return_date)}
                    </td>

                    <td className="border p-3 text-center align-top">
                      <Badge variant="outline" className={config.className}>
                        {config.label}
                      </Badge>
                    </td>

                    <td className="border p-3 text-center align-top">
                      {canReturn ? (
                        <Button
                          size="sm"
                          disabled={isReturnPending}
                          onClick={() => handleReturn(record)}
                          className="h-8 bg-emerald-600 px-2.5 text-xs text-white hover:bg-emerald-700"
                        >
                          {isReturnPending ? (
                            <Loader2Icon className="size-3.5 animate-spin" />
                          ) : (
                            <BookCheckIcon className="size-3.5" />
                          )}
                          <span>Xác nhận trả sách</span>
                        </Button>
                      ) : (
                        <div className="flex items-center justify-center gap-1 text-xs text-emerald-600">
                          <CheckCircle2Icon className="size-3.5" />
                          <span>Đã hoàn tất</span>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BorrowAdminPage
