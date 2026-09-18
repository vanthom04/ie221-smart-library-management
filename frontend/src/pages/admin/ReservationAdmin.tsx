import { useState } from "react"
import {
  AlertCircleIcon,
  CheckIcon,
  ClockIcon,
  FilterIcon,
  Loader2Icon,
  UserCheckIcon,
  XIcon
} from "lucide-react"

import { useAnimatedToast } from "@/components/ui/animated-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  useAdminReservations,
  useApproveReservation,
  useBorrowFromReservation,
  useRejectReservation
} from "@/features/admin-borrowing/hooks"
import type { Reservation, ReservationStatus } from "@/features/admin-borrowing/types"
import { isApiError } from "@/lib/api-error"

const STATUS_CONFIG: Record<ReservationStatus, { label: string; className: string }> = {
  pending: { label: "Chờ duyệt", className: "bg-amber-100 text-amber-800 border-amber-300" },
  approved: { label: "Đã duyệt", className: "bg-blue-100 text-blue-800 border-blue-300" },
  fulfilled: {
    label: "Đã mượn sách",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300"
  },
  rejected: { label: "Bị từ chối", className: "bg-red-100 text-red-800 border-red-300" },
  cancelled: { label: "Đã hủy", className: "bg-slate-100 text-slate-700 border-slate-300" },
  expired: { label: "Hết hạn", className: "bg-zinc-100 text-zinc-700 border-zinc-300" }
}

const formatDate = (value: string | null) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(
        new Date(value)
      )
    : "—"

export const ReservationAdminPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | "all">("all")
  const [rejectDialogReservation, setRejectDialogReservation] = useState<Reservation | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [rejectReasonError, setRejectReasonError] = useState<string | null>(null)

  const {
    data: reservations = [],
    isLoading,
    error
  } = useAdminReservations(selectedStatus === "all" ? undefined : selectedStatus)

  const approveMutation = useApproveReservation()
  const rejectMutation = useRejectReservation()
  const borrowMutation = useBorrowFromReservation()
  const { addToast } = useAnimatedToast()

  const handleApprove = async (reservation: Reservation) => {
    try {
      await approveMutation.mutateAsync(reservation.id)
      addToast({
        type: "success",
        title: "Duyệt thành công",
        message: `Đã duyệt phiếu đặt trước #${reservation.id.slice(0, 8)}.`
      })
    } catch (err) {
      addToast({
        type: "error",
        title: "Không thể duyệt phiếu đặt",
        message: isApiError(err) ? err.message : "Đã có lỗi xảy ra. Vui lòng thử lại sau."
      })
    }
  }

  const handleOpenRejectDialog = (reservation: Reservation) => {
    setRejectDialogReservation(reservation)
    setRejectReason("")
    setRejectReasonError(null)
  }

  const handleConfirmReject = async () => {
    if (!rejectDialogReservation) return
    const trimmed = rejectReason.trim()
    if (trimmed.length < 3) {
      setRejectReasonError("Lý do từ chối phải có ít nhất 3 ký tự.")
      return
    }

    try {
      await rejectMutation.mutateAsync({
        id: rejectDialogReservation.id,
        reason: trimmed
      })
      addToast({
        type: "success",
        title: "Đã từ chối phiếu đặt",
        message: `Đã từ chối phiếu đặt #${rejectDialogReservation.id.slice(0, 8)}.`
      })
      setRejectDialogReservation(null)
    } catch (err) {
      addToast({
        type: "error",
        title: "Không thể từ chối phiếu đặt",
        message: isApiError(err) ? err.message : "Đã có lỗi xảy ra. Vui lòng thử lại sau."
      })
    }
  }

  const handleBorrowFromReservation = async (reservation: Reservation) => {
    try {
      await borrowMutation.mutateAsync(reservation.id)
      addToast({
        type: "success",
        title: "Chuyển mượn sách thành công",
        message: `Đã lập phiếu mượn sách cho phiếu đặt #${reservation.id.slice(0, 8)}.`
      })
    } catch (err) {
      addToast({
        type: "error",
        title: "Không thể tạo phiếu mượn",
        message: isApiError(err) ? err.message : "Đã có lỗi xảy ra. Vui lòng thử lại sau."
      })
    }
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">📋 Quản lý Đặt trước (Reservations)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Duyệt, từ chối và chuyển phiếu đặt trước đã duyệt thành phiếu mượn sách.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FilterIcon className="size-4 text-gray-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ReservationStatus | "all")}
            className="rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt (Pending)</option>
            <option value="approved">Đã duyệt (Approved)</option>
            <option value="fulfilled">Đã mượn (Fulfilled)</option>
            <option value="rejected">Bị từ chối (Rejected)</option>
            <option value="cancelled">Đã hủy (Cancelled)</option>
            <option value="expired">Hết hạn (Expired)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircleIcon className="size-5" />
          <span>Lỗi khi tải danh sách đặt trước. Vui lòng thử lại sau.</span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="border p-3 text-left">Mã & Ngày tạo</th>
              <th className="border p-3 text-left">Độc giả</th>
              <th className="border p-3 text-left">Sách đặt</th>
              <th className="border p-3 text-left">Hạn nhận sách</th>
              <th className="border p-3 text-center">Trạng thái</th>
              <th className="border p-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2Icon className="size-5 animate-spin text-blue-600" />
                    <span>Đang tải danh sách đặt trước...</span>
                  </div>
                </td>
              </tr>
            ) : reservations.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Chưa có phiếu đặt trước nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              reservations.map((reservation) => {
                const config = STATUS_CONFIG[reservation.status] || {
                  label: reservation.status,
                  className: "bg-gray-100 text-gray-700"
                }
                const isApprovePending =
                  approveMutation.isPending && approveMutation.variables === reservation.id
                const isBorrowPending =
                  borrowMutation.isPending && borrowMutation.variables === reservation.id

                return (
                  <tr key={reservation.id} className="transition-colors hover:bg-gray-50">
                    <td className="border p-3 align-top">
                      <div className="font-mono text-xs font-medium text-gray-900">
                        #{reservation.id.slice(0, 8)}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <ClockIcon className="size-3" />
                        <span>{formatDate(reservation.created_at)}</span>
                      </div>
                    </td>

                    <td className="border p-3 align-top">
                      <span className="inline-block rounded bg-gray-100 px-2 py-1 font-mono text-xs text-gray-700">
                        {reservation.user_id.slice(0, 8)}...
                      </span>
                    </td>

                    <td className="border p-3 align-top">
                      <ul className="space-y-1">
                        {reservation.items.map((item) => (
                          <li key={item.id} className="text-gray-800">
                            <span className="font-medium">{item.title}</span>{" "}
                            <span className="text-xs text-gray-500">
                              (x{item.quantity} - ISBN: {item.isbn})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>

                    <td className="border p-3 align-top text-gray-600">
                      {formatDate(reservation.expires_at)}
                    </td>

                    <td className="border p-3 text-center align-top">
                      <Badge variant="outline" className={config.className}>
                        {config.label}
                      </Badge>
                      {reservation.rejection_reason && (
                        <p className="mt-1 text-xs text-red-600 italic">
                          Lý do: {reservation.rejection_reason}
                        </p>
                      )}
                    </td>

                    <td className="border p-3 text-center align-top">
                      {reservation.status === "pending" && (
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <Button
                            size="sm"
                            disabled={isApprovePending || rejectMutation.isPending}
                            onClick={() => handleApprove(reservation)}
                            className="h-8 bg-emerald-600 px-2.5 text-xs text-white hover:bg-emerald-700"
                          >
                            {isApprovePending ? (
                              <Loader2Icon className="size-3.5 animate-spin" />
                            ) : (
                              <CheckIcon className="size-3.5" />
                            )}
                            <span>Duyệt</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isApprovePending || rejectMutation.isPending}
                            onClick={() => handleOpenRejectDialog(reservation)}
                            className="h-8 border-red-300 px-2.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <XIcon className="size-3.5" />
                            <span>Từ chối</span>
                          </Button>
                        </div>
                      )}

                      {reservation.status === "approved" && (
                        <Button
                          size="sm"
                          disabled={isBorrowPending}
                          onClick={() => handleBorrowFromReservation(reservation)}
                          className="h-8 bg-blue-600 px-3 text-xs text-white hover:bg-blue-700"
                        >
                          {isBorrowPending ? (
                            <Loader2Icon className="size-3.5 animate-spin" />
                          ) : (
                            <UserCheckIcon className="size-3.5" />
                          )}
                          <span>Xác nhận cho mượn</span>
                        </Button>
                      )}

                      {reservation.status !== "pending" && reservation.status !== "approved" && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={Boolean(rejectDialogReservation)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectDialogReservation(null)
            setRejectReason("")
            setRejectReasonError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Từ chối phiếu đặt trước</DialogTitle>
            <DialogDescription>
              Vui lòng nhập lý do từ chối để phản hồi đến độc giả (tối thiểu 3 ký tự).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="block text-sm font-medium text-gray-700">Lý do từ chối:</label>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value)
                if (rejectReasonError && e.target.value.trim().length >= 3) {
                  setRejectReasonError(null)
                }
              }}
              placeholder="VD: Sách đang được kiểm kê hoặc bảo trì..."
              className="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {rejectReasonError && <p className="text-xs text-red-600">{rejectReasonError}</p>}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              type="button"
              disabled={rejectMutation.isPending}
              onClick={() => setRejectDialogReservation(null)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={rejectMutation.isPending}
              onClick={handleConfirmReject}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {rejectMutation.isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  <span>Đang từ chối...</span>
                </>
              ) : (
                "Xác nhận từ chối"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReservationAdminPage
