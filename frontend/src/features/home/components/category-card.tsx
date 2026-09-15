import { cn } from "@/lib/utils"

import type { CategoryItemType } from "../types"

export const CategoryCard = ({ category }: { category: CategoryItemType }) => {
  return (
    <div className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl bg-slate-50 px-4 py-5 text-center transition-colors hover:bg-slate-100">
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl",
          category.colorClass,
          category.textColorClass
        )}
      >
        {category.icon}
      </div>
      <p className="text-sm font-medium text-slate-600">{category.title}</p>
    </div>
  )
}
