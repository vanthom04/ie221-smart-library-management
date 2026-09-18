import { useState } from "react"
import { BookMarkedIcon, CalendarClockIcon, PackageCheckIcon, XIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useAnimatedToast } from "@/components/ui/animated-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { useCancelReservation, useMyReservations } from "@/features/borrowing/hooks"
import type { ReservationStatus } from "@/features/borrowing/types"
import { isApiError } from "@/lib/api-error"

const STATUS: Record<ReservationStatus, { label: string; className: string }> = {
  pending: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-800" },
  approved: { label: "Đã duyệt", className: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Đã hủy", className: "bg-slate-100 text-slate-700" },
  expired: { label: "Hết hạn", className: "bg-zinc-100 text-zinc-700" }
}

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value)
      )
    : "—"

export const BookReservationPage = () => {
  const [reservationToCancel, setReservationToCancel] = useState<string | null>(null)
  const { data = [], isPending, error } = useMyReservations()
  const cancelMutation = useCancelReservation()
  const { addToast } = useAnimatedToast()

  const confirmCancel = async () => {
    if (!reservationToCancel) return
    try {
      await cancelMutation.mutateAsync(reservationToCancel)
      addToast({
        type: "success",
        title: "Đã hủy đặt trước",
        message: "Sách đã được trả lại kho giữ chỗ."
      })
      setReservationToCancel(null)
    } catch (mutationError) {
      addToast({
        type: "error",
        title: "Không thể hủy",
        message: isApiError(mutationError) ? mutationError.message : "Vui lòng thử lại sau."
      })
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Sách đã đặt trước</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi trạng thái duyệt và thời hạn đến nhận sách tại thư viện.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <XIcon />
          <AlertTitle>Không tải được danh sách</AlertTitle>
          <AlertDescription>
            {isApiError(error) ? error.message : "Vui lòng thử lại sau."}
          </AlertDescription>
        </Alert>
      )}

      {isPending && (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((item) => (
            <Skeleton key={item} className="h-52" />
          ))}
        </div>
      )}

      {!isPending && !error && data.length === 0 && (
        <Empty className="min-h-72 border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookMarkedIcon />
            </EmptyMedia>
            <EmptyTitle>Chưa có phiếu đặt trước</EmptyTitle>
            <EmptyDescription>Chọn một cuốn sách trong trang tìm kiếm để bắt đầu.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((reservation) => {
          const canCancel = reservation.status === "pending" || reservation.status === "approved"
          const statusInfo = STATUS[reservation.status]
          return (
            <Card key={reservation.id} className="shadow-sm">
              <CardHeader className="border-b">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>Phiếu #{reservation.id.slice(0, 8)}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Tạo lúc {formatDate(reservation.created_at)}
                    </p>
                  </div>
                  <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {reservation.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                    >
                      <PackageCheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ISBN {item.isbn} · Số lượng {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {reservation.expires_at && reservation.status === "approved" && (
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <CalendarClockIcon className="size-4" /> Nhận trước{" "}
                    {formatDate(reservation.expires_at)}
                  </div>
                )}
                {canCancel && (
                  <Button variant="outline" onClick={() => setReservationToCancel(reservation.id)}>
                    Hủy đặt trước
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AlertDialog
        open={reservationToCancel !== null}
        onOpenChange={(open) => !open && setReservationToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy phiếu đặt trước?</AlertDialogTitle>
            <AlertDialogDescription>
              Nếu phiếu đã duyệt, số sách giữ chỗ sẽ được trả lại kho.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Giữ lại</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} disabled={cancelMutation.isPending}>
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
