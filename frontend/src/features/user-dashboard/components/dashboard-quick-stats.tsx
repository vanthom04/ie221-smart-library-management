import { DashboardStatCard } from "./dashboard-stat-card"
import type { DashboardQuickStat } from "../types"

interface DashboardQuickStatsProps {
  stats: DashboardQuickStat[]
}

export const DashboardQuickStats = ({ stats }: DashboardQuickStatsProps) => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <DashboardStatCard key={stat.id} {...stat} />
      ))}
    </section>
  )
}
