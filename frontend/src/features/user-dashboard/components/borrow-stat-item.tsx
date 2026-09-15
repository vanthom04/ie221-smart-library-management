import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import type { BorrowSummaryStat } from "../types"

export const BorrowStatItem = ({ label, value, unit, trend }: BorrowSummaryStat) => {
  const TrendIcon = trend?.direction === "up" ? TrendingUpIcon : TrendingDownIcon

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground lg:text-[13px] xl:text-sm">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-semibold text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-sm font-medium",
              trend.direction === "up" ? "text-emerald-600" : "text-red-600"
            )}
          >
            <TrendIcon className="size-3.5" />
            {trend.value}
          </span>
        )}
      </div>
    </div>
  )
}
