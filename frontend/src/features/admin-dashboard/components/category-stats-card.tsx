import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CategoryDonutChart } from "./category-donut-chart"
import { CategoryLegendItem } from "./category-legend-item"
import type { CategoryStat } from "../../admin-dashboard/types"
import { BookOpenIcon, Inbox } from "lucide-react"

interface CategoryStatsCardProps {
  data: CategoryStat[]
}

export const CategoryStatsCard = ({ data }: CategoryStatsCardProps) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle className="text-base font-bold">Thống kê thể loại yêu thích</CardTitle>
        <p className="text-xs text-muted-foreground">Phân bố sở thích đọc sách của bạn đọc</p>
      </CardHeader>

      <CardContent>

        {data.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center rounded-xl border border-dashed border-border min-h-[300px] p-6 text-center">
            <Inbox className="size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm font-medium text-foreground">Bạn chưa thêm thể loại yêu thích</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Hãy thêm thể loại yêu thích để xem thống kê phân bố sở thích đọc sách của bạn đọc.
            </p>
          </div>
        ):(
          <>
            <div className="flex shrink-0 justify-center">
            <CategoryDonutChart data={data} total={total} />
            </div>

            <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5">
              {data.map((item) => (
                <CategoryLegendItem key={item.categoryKey} {...item} />
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
