import { Link } from "react-router"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { BookCoverThumb } from "./book-cover-thumb"
import type { BookSuggestion } from "../types"

interface SuggestedBooksCardProps {
  books: BookSuggestion[]
}

export const SuggestedBooksCard = ({ books }: SuggestedBooksCardProps) => {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-base font-bold">Gợi ý dành cho bạn</CardTitle>
          <SparklesIcon className="size-4 text-blue-500" />
        </div>
        <p className="text-xs text-muted-foreground">Dựa trên sở thích và thể loại hay đọc</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
            >
              <BookCoverThumb
                src={book.coverUrl}
                alt={book.title}
                fallbackTitle={book.title}
                className="w-11"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                  {book.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">{book.author}</p>
                {book.category && (
                  <Badge variant="outline" className="h-4.5 px-1.5 text-[10px] font-normal">
                    {book.category}
                  </Badge>
                )}
              </div>
              <Link
                to="/search"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "h-7 shrink-0 rounded-lg px-2.5 text-xs text-muted-foreground hover:text-foreground"
                )}
              >
                Xem
              </Link>
            </div>
          ))}
        </div>

        <Link
          to="/search"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "w-full justify-between text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/40"
          )}
        >
          <span>Khám phá thêm sách</span>
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
