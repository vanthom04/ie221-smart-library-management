import * as React from "react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  useRecharts,
  type ChartConfig
} from "@/components/ui/chart"

import { CATEGORY_COLORS } from "../constants"
import type { CategoryStat } from "../types"

interface CategoryDonutChartProps {
  data: CategoryStat[]
  total: number
}

function CategoryDonutChartContent({ data, total }: CategoryDonutChartProps) {
  const { Label, Pie, PieChart } = useRecharts()

  const chartConfig = data.reduce<ChartConfig>((config, item) => {
    config[item.categoryKey] = { label: item.label, color: CATEGORY_COLORS[item.categoryKey] }
    return config
  }, {})

  const chartData = data.map((item) => ({
    ...item,
    fill: `var(--color-${item.categoryKey})`
  }))

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square size-44">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel nameKey="categoryKey" />}
        />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="categoryKey"
          innerRadius={48}
          outerRadius={72}
          strokeWidth={3}
        >
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null
              return (
                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) - 2}
                    className="fill-foreground text-xl font-bold"
                  >
                    {total}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) + 16}
                    className="fill-muted-foreground text-xs"
                  >
                    lượt mượn
                  </tspan>
                </text>
              )
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export const CategoryDonutChart = (props: CategoryDonutChartProps) => {
  return (
    <React.Suspense fallback={<div className="mx-auto aspect-square size-44" />}>
      <CategoryDonutChartContent {...props} />
    </React.Suspense>
  )
}
