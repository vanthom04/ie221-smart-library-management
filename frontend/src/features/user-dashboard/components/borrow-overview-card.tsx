import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import { BorrowStatItem } from "./borrow-stat-item"
import { BorrowTrendChart } from "./borrow-trend-chart"
import type { BorrowSummaryStat, BorrowTrendPoint } from "../types"

const PERIOD_OPTIONS = [
  { value: "3m", label: "3 tháng gần đây" },
  { value: "6m", label: "6 tháng gần đây" },
  { value: "12m", label: "12 tháng gần đây" }
] as const

interface BorrowOverviewCardProps {
  data: BorrowTrendPoint[]
  stats: BorrowSummaryStat[]
  period: string
  onPeriodChange?: (period: string) => void
}

export const BorrowOverviewCard = ({
  data,
  stats,
  period,
  onPeriodChange
}: BorrowOverviewCardProps) => {
  return (
    <Card className="gap-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Tổng quan mượn sách</CardTitle>
        <Select
          value={period}
          items={PERIOD_OPTIONS}
          onValueChange={(value) => {
            if (value !== null) {
              onPeriodChange?.(value)
            }
          }}
        >
          <SelectTrigger className="w-42">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {PERIOD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-muted-foreground">Số lượt mượn</p>
          <BorrowTrendChart data={data} />
        </div>

        <div className="grid grid-cols-3 divide-x divide-border border-t pt-4">
          {stats.map((stat) => (
            <div key={stat.label} className="px-4 first:pl-0">
              <BorrowStatItem {...stat} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
