import { BookOpenIcon, CheckIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AdminPendingRequest } from "../types"

interface PendingRequestsCardProps {
  requests: AdminPendingRequest[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export const PendingRequestsCard = ({
  requests,
  onApprove,
  onReject,
}: PendingRequestsCardProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Yêu cầu chờ phê duyệt</h2>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          {requests.length} cần xử lý
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
          <BookOpenIcon className="size-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm font-medium text-foreground">Không có yêu cầu chờ xử lý</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Hiện tại không có yêu cầu mượn sách nào cần phê duyệt.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 p-3.5 hover:bg-accent/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{req.userName}</span>
                </div>
                <p className="text-xs font-medium text-foreground line-clamp-1">{req.bookTitle}</p>
                <p className="text-[11px] text-muted-foreground">Ngày tạo: {req.requestDate}</p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => onApprove?.(req.id)}
                >
                  <CheckIcon className="mr-1 size-3.5" /> Duyệt
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-rose-500 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => onReject?.(req.id)}
                >
                  <XIcon className="mr-1 size-3.5" /> Từ chối
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
  </div>
  )
}