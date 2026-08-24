import { BellIcon, CheckCircle2Icon, MailIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export const DashboardReminderCard = () => {
  return (
    <Card className="relative overflow-hidden border-blue-100/90 bg-blue-50/60 p-5 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/20">
      <CardContent className="p-0">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <BellIcon className="size-4" />
          </div>
          <h2 className="text-base font-bold text-blue-950 dark:text-blue-200">Nhắc nhở</h2>
        </div>

        <p className="mt-2.5 max-w-[75%] text-xs leading-relaxed text-muted-foreground">
          Vui lòng kiểm tra email để nhận thông báo khi yêu cầu đặt trước sách của bạn được phê
          duyệt.
        </p>

        <div className="absolute right-4 bottom-4">
          <div className="relative">
            <MailIcon className="size-9 text-blue-300 dark:text-blue-600" strokeWidth={1.5} />
            <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 shadow-xs">
              <CheckCircle2Icon className="size-3 text-white" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
