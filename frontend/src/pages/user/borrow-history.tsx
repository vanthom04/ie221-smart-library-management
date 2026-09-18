import { BookOpenCheckIcon, CalendarClockIcon, HistoryIcon, RotateCwIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAnimatedToast } from "@/components/ui/animated-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useMyBorrowRecords, useRenewBorrowRecord } from "@/features/borrowing/hooks"
import type { BorrowRecord, BorrowStatus } from "@/features/borrowing/types"
import { isApiError } from "@/lib/api-error"

const STATUS: Record<BorrowStatus, { label: string; className: string }> = {
  borrowing: { label: "Đang mượn", className: "bg-blue-100 text-blue-700" },
  returned: { label: "Đã trả", className: "bg-emerald-100 text-emerald-800" },
  overdue: { label: "Quá hạn", className: "bg-red-100 text-red-700" }
}

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value)
      )
    : "—"

export const BorrowHistoryPage = () => {
  const { data = [], isPending, error } = useMyBorrowRecords()
  const renewMutation = useRenewBorrowRecord()
  const { addToast } = useAnimatedToast()

  const renew = async (record: BorrowRecord) => {
    try {
      const updated = await renewMutation.mutateAsync(record.id)
      addToast({
        type: "success",
        title: "Gia hạn thành công",
        message: `Hạn trả mới là ${formatDate(updated.due_date)}.`
      })
    } catch (mutationError) {
      addToast({
        type: "error",
        title: "Không thể gia hạn",
        message: isApiError(mutationError) ? mutationError.message : "Vui lòng thử lại sau."
      })
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lịch sử mượn trả</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Xem sách đang mượn, hạn trả và gửi yêu cầu gia hạn.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <HistoryIcon />
          <AlertTitle>Không tải được lịch sử</AlertTitle>
          <AlertDescription>
            {isApiError(error) ? error.message : "Vui lòng thử lại sau."}
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <div className="space-y-4">
          {[0, 1].map((item) => (
            <Skeleton key={item} className="h-52" />
          ))}
        </div>
      )}

      {!isPending && !error && data.length === 0 && (
        <Empty className="min-h-72 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpenCheckIcon />
            </EmptyMedia>
            <EmptyTitle>Chưa có lịch sử mượn</EmptyTitle>
            <EmptyDescription>Các phiếu mượn của bạn sẽ xuất hiện tại đây.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <div className="space-y-4">
        {data.map((record) => {
          const statusInfo = STATUS[record.status]
          const canRenew = record.status === "borrowing"
          return (
            <Card key={record.id} className="shadow-sm">
              <CardHeader className="border-b">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>Phiếu mượn #{record.id.slice(0, 8)}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ngày mượn {formatDate(record.borrow_date)}
                    </p>
                  </div>
                  <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  {record.items.map((item) => (
                    <div key={item.id} className="rounded-lg bg-muted/50 p-3">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        ISBN {item.isbn} · Số lượng {item.quantity}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <CalendarClockIcon className="size-4 text-primary" />
                    <span>
                      Hạn trả: <strong>{formatDate(record.due_date)}</strong>
                    </span>
                  </div>
                  {canRenew && (
                    <Button onClick={() => renew(record)} disabled={renewMutation.isPending}>
                      <RotateCwIcon /> Gia hạn
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
