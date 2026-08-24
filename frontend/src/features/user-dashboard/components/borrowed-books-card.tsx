import { Link } from "react-router"
import { ArrowRightIcon, BookOpenIcon, ClockIcon, MoreVerticalIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { BookCoverThumb } from "./book-cover-thumb"
import type { BorrowedBook } from "../types"

interface BorrowedBooksCardProps {
  books: BorrowedBook[]
  onRenew?: (bookId: string) => void
}

const getDueBadgeStyle = (daysLeft: number) => {
  if (daysLeft <= 3) {
    return {
      className:
        "border-red-200/80 bg-red-100 text-red-700 dark:border-red-900/40 dark:bg-red-950/50 dark:text-red-300",
      label: `Còn ${daysLeft} ngày`
    }
  }
  if (daysLeft <= 7) {
    return {
      className:
        "border-amber-200/80 bg-amber-100 text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/50 dark:text-amber-300",
      label: `Còn ${daysLeft} ngày`
    }
  }
  return {
    className:
      "border-emerald-200/80 bg-emerald-100 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/50 dark:text-emerald-300",
    label: `Còn ${daysLeft} ngày`
  }
}

export const BorrowedBooksCard = ({ books, onRenew }: BorrowedBooksCardProps) => {
  return (
    <Card className="flex flex-col justify-between shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-bold">Danh sách đang mượn</CardTitle>
          <p className="text-xs text-muted-foreground">Theo dõi và gia hạn sách kịp thời</p>
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

      <CardContent className="flex flex-1 flex-col gap-4">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-8 text-center">
            <BookOpenIcon className="size-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm font-medium text-foreground">Bạn chưa mượn cuốn sách nào</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Hãy khám phá thư viện để chọn những tựa sách yêu thích.
            </p>
            <Link
              to="/search"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4 h-8 text-xs")}
            >
              Tìm sách ngay
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {books.map((book) => {
              const badgeInfo = getDueBadgeStyle(book.daysLeft)

              return (
                <div key={book.id} className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0">
                  <BookCoverThumb
                    src={book.coverUrl}
                    alt={book.title}
                    fallbackTitle={book.title}
                    className="w-11"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1">
                    <p className="truncate text-sm font-semibold text-foreground">{book.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <ClockIcon className="size-3" />
                        Hạn: {book.dueDate}
                      </span>
                      <Badge
                        variant="secondary"
                        className={cn("h-5 px-2 text-[11px] font-medium", badgeInfo.className)}
                      >
                        {badgeInfo.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRenew?.(book.id)}
                      className="h-8 rounded-lg border-border/80 px-2.5 text-xs font-medium hover:bg-primary/5 hover:text-primary"
                    >
                      Gia hạn
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-foreground"
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
