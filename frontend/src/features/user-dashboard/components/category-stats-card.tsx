import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CategoryDonutChart } from "./category-donut-chart"
import { CategoryLegendItem } from "./category-legend-item"
import type { CategoryStat } from "../types"

interface CategoryStatsCardProps {
  data: CategoryStat[]
}

export const CategoryStatsCard = ({ data }: CategoryStatsCardProps) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle className="text-base font-bold">Thống kê thể loại yêu thích</CardTitle>
        <p className="text-xs text-muted-foreground">Phân bố sở thích đọc sách của bạn</p>
      </CardHeader>

      <CardContent>
        <div className="flex shrink-0 justify-center">
          <CategoryDonutChart data={data} total={total} />
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5">
          {data.map((item) => (
            <CategoryLegendItem key={item.categoryKey} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
