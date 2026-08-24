import { CATEGORY_COLORS } from "../constants"
import type { CategoryStat } from "../types"

export const CategoryLegendItem = ({ categoryKey, label, count, percentage }: CategoryStat) => {
  return (
    <div className="flex items-center justify-between gap-2 text-xs xl:text-sm">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="size-2.5 shrink-0 rounded-xs"
          style={{ backgroundColor: CATEGORY_COLORS[categoryKey] }}
        />
        <span className="truncate font-medium text-foreground">{label}</span>
      </div>
      <span className="shrink-0 text-muted-foreground">
        {count} lượt ({percentage}%)
      </span>
    </div>
  )
}
