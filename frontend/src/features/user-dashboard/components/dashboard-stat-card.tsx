import { Link } from "react-router"
import {
  ArrowRightIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  HistoryIcon,
  WalletIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { STAT_TONE_STYLES } from "../constants"
import type { DashboardQuickStat, StatIconType } from "../types"

const ICON_COMPONENTS: Record<StatIconType, React.ComponentType<{ className?: string }>> = {
  book: BookOpenIcon,
  history: HistoryIcon,
  wallet: WalletIcon,
  calendar: CalendarCheckIcon
}

export const DashboardStatCard = ({ title, value, unit, icon, tone, href }: DashboardQuickStat) => {
  const IconComponent = ICON_COMPONENTS[icon] || BookOpenIcon
  const styles = STAT_TONE_STYLES[tone]

  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
        styles.container
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg shadow-2xs transition-transform group-hover:scale-105",
            styles.iconBg
          )}
        >
          <IconComponent className="size-5" />
        </div>
      </div>

      <div className="mt-3 border-t border-border/40 pt-2.5">
        <Link
          to={href}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:underline hover:underline-offset-4",
            styles.linkHover
          )}
        >
          Xem chi tiết{" "}
          <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  )
}
