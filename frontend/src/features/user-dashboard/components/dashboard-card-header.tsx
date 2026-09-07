import { Link } from "react-router"
import { ArrowRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button.variants"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardHeaderProps {
  description: string
  title: string
}

export const DashboardCardHeader = ({ description, title }: DashboardCardHeaderProps) => (
  <CardHeader className="flex flex-row items-center justify-between pb-3">
    <div>
      <CardTitle className="text-base font-bold">{title}</CardTitle>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
    <Link
      to="/borrow-history"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "h-8 gap-1 text-xs text-primary"
      )}
    >
      Xem tất cả <ArrowRightIcon className="size-3.5" />
    </Link>
  </CardHeader>
)
