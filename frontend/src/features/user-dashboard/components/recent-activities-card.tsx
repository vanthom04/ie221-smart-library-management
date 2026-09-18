import {
  AlertTriangleIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ClockIcon,
  SparklesIcon
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { DashboardCardHeader } from "./dashboard-card-header"
import { ACTIVITY_TONE_STYLES } from "../constants"
import type { ActivityItem, ActivityTypeTone } from "../types"

interface RecentActivitiesCardProps {
  activities: ActivityItem[]
}

const getActivityIcon = (tone: ActivityTypeTone) => {
  switch (tone) {
    case "green":
      return <CheckCircleIcon className="size-4" />
    case "blue":
      return <BookOpenIcon className="size-4" />
    case "amber":
      return <ClockIcon className="size-4" />
    case "red":
      return <AlertTriangleIcon className="size-4" />
    default:
      return <SparklesIcon className="size-4" />
  }
}

export const RecentActivitiesCard = ({ activities }: RecentActivitiesCardProps) => {
  return (
    <Card className="flex flex-col justify-between gap-2 shadow-xs">
      <DashboardCardHeader title="Hoạt động gần đây" description="Nhật ký mượn trả và tương tác" />

      <CardContent className="flex flex-1 flex-col gap-4">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
            <ClockIcon className="size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm font-medium text-foreground">Chưa có hoạt động nào</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Mọi hoạt động mượn trả sẽ hiển thị tại đây.
            </p>
          </div>
        ) : (
          <ul className="space-y-3.5">
            {activities.map((activity) => (
              <li
                key={activity.id}
                className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/40"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full shadow-2xs",
                    ACTIVITY_TONE_STYLES[activity.iconTone]
                  )}
                >
                  {getActivityIcon(activity.iconTone)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-foreground">
                    {activity.description}{" "}
                    {activity.bookTitle && (
                      <span className="font-semibold text-foreground">
                        &quot;{activity.bookTitle}&quot;
                      </span>
                    )}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-muted-foreground">
                  <p className="font-medium">{activity.date}</p>
                  <p className="text-[11px] opacity-80">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
