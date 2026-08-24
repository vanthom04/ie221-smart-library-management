import { Link } from "react-router"
import { ArrowRightIcon, BookSearchIcon, HistoryIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DashboardWelcomeBannerProps {
  userName?: string
  subtitle?: string
}

export const DashboardWelcomeBanner = ({
  userName = "Nguyễn Văn An",
  subtitle = "Hôm nay là một ngày tuyệt vời để học hỏi và khám phá tri thức mới."
}: DashboardWelcomeBannerProps) => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-100/80 bg-linear-to-br from-blue-50/90 via-indigo-50/40 to-card p-6 shadow-xs dark:border-blue-900/30 dark:from-blue-950/20 dark:via-background dark:to-card">
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
          <span>👋 Chào mừng trở lại</span>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Xin chào, {userName}!
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {subtitle}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link
            to="/search"
            className={cn(buttonVariants({ size: "sm" }), "h-9 gap-1.5 rounded-lg px-4 shadow-xs")}
          >
            <BookSearchIcon className="size-4" />
            Khám phá sách
            <ArrowRightIcon className="size-3.5" />
          </Link>
          <Link
            to="/borrow-history"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-9 gap-1.5 rounded-lg border-border/80 bg-card/80 px-4 backdrop-blur-xs hover:bg-muted"
            )}
          >
            <HistoryIcon className="size-4" />
            Lịch sử mượn trả
          </Link>
        </div>
      </div>

      <img
        src="/images/dashboard-welcome.png"
        alt="Dashboard Welcome"
        className="pointer-events-none absolute right-0 bottom-0 hidden w-52 object-contain opacity-90 sm:block md:w-60 lg:w-64"
      />
    </section>
  )
}
