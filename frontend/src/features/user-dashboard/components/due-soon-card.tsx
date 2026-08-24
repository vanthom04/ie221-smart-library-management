import { Link } from "react-router"
import { ArrowRightIcon, ClockIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { BookCoverThumb } from "./book-cover-thumb"
import type { DueSoonBook } from "../types"

interface DueSoonCardProps {
  books: DueSoonBook[]
}

export const DueSoonCard = ({ books }: DueSoonCardProps) => {
  return (
    <Card className="border-amber-200/80 bg-amber-50/50 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400">
            <ClockIcon className="size-4" />
          </div>
          <CardTitle className="text-base font-bold text-amber-950 dark:text-amber-200">
            Sách sắp đến hạn
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {books.length === 0 ? (
          <p className="text-xs text-muted-foreground">Không có sách nào sắp đến hạn cần trả.</p>
        ) : (
          <div className="space-y-3">
            {books.map((book) => {
              const isUrgent = book.daysLeft <= 3
              return (
                <div
                  key={book.id}
                  className="flex items-center gap-3 rounded-lg border border-amber-100 bg-background/80 p-2 shadow-2xs dark:border-amber-900/30"
                >
                  <BookCoverThumb
                    src={book.coverUrl}
                    alt={book.title}
                    fallbackTitle={book.title}
                    className="w-10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{book.title}</p>
                    <p className="text-xs text-muted-foreground">Hạn trả: {book.dueDate}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 shrink-0 px-2 text-[10px] font-semibold",
                      isUrgent
                        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    )}
                  >
                    Còn {book.daysLeft} ngày
                  </Badge>
                </div>
              )
            })}
          </div>
        )}

        <Link
          to="/borrow-history"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-between text-xs text-amber-800 hover:bg-amber-100/70 hover:text-amber-900 dark:text-amber-300 dark:hover:bg-amber-950/50"
          )}
        >
          <span>Xem tất cả sách đang mượn</span>
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
