import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart"

import type { BorrowTrendPoint } from "../types"

const chartConfig = {
  count: {
    label: "Số lượt mượn",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig

interface BorrowTrendChartProps {
  data: BorrowTrendPoint[]
}

export function BorrowTrendChart({ data }: BorrowTrendChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-55 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
        <defs>
          <linearGradient id="fillBorrowCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={28}
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area
          dataKey="count"
          type="monotone"
          fill="url(#fillBorrowCount)"
          stroke="var(--color-count)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-count)", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
