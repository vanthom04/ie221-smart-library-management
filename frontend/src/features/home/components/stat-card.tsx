import { Link } from "react-router"

import { cn } from "@/lib/utils"

import type { StatItemType } from "../types"
import { ArrowRightIcon } from "lucide-react"

export const StatCard = ({ stat }: { stat: StatItemType }) => {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          stat.colorClass,
          stat.textColorClass
        )}
      >
        {stat.icon}
      </div>
      <div>
        <p className="text-2xl leading-tight font-bold text-slate-800">{stat.value}</p>
        <p className="mb-1.5 text-sm text-slate-500">{stat.title}</p>
        <Link
          to="#"
          className={cn(
            "inline-flex items-center gap-1 text-sm font-medium hover:underline hover:underline-offset-2 [&_svg]:size-4",
            stat.textColorClass
          )}
        >
          {stat.actionText} <ArrowRightIcon />
        </Link>
      </div>
    </div>
  )
}
