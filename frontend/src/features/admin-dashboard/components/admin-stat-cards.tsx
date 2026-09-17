import type { AdminQuickStat } from "../types"
import { ICON_MAP, TONE_MAP } from "../constants"

export const AdminStatCards = ({ stats }: { stats: AdminQuickStat[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = ICON_MAP[stat.icon] || ICON_MAP["books"]
        const toneStyle = TONE_MAP[stat.tone]

        return (
          <div
            key={stat.id}
            className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                  {stat.unit && <span className="text-xs text-muted-foreground">{stat.unit}</span>}
                </div>
              </div>
              <div className={`flex size-10 items-center justify-center rounded-lg border ${toneStyle}`}>
                <Icon className="size-5" />
              </div>
            </div>
            {stat.change && (
              <div className="mt-4 border-t border-border/50 pt-2 text-xs text-muted-foreground">
                {stat.change}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}