import { ClockIcon } from "lucide-react"
import type { AdminRecentBorrow } from "../types"

interface RecentBorrowsTableProps {
  borrows: AdminRecentBorrow[]
}

export const RecentBorrowsTable = ({ borrows }: RecentBorrowsTableProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Nhật ký mượn/trả gần đây</h2>
      </div>
      {borrows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
          <ClockIcon className="size-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm font-medium text-foreground">Không có nhật ký mượn/trả gần đây</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Hiện tại không có hoạt động mượn/trả sách nào.
          </p>
        </div>
      ):(
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
              {borrows.map((item) => (
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
      )}
    </div>
  )
}