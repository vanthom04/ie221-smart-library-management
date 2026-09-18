import { Link } from "react-router"
import { ArrowRightIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button.variants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import { BookCoverThumb } from "./book-cover-thumb"
import type { BookSuggestion } from "../types"

interface SuggestedBooksCardProps {
  books: BookSuggestion[]
  basedOnBooks?: number
  isLoading?: boolean
  isError?: boolean
}

export const SuggestedBooksCard = ({
  books,
  basedOnBooks,
  isLoading,
  isError
}: SuggestedBooksCardProps) => {
  return (
    <Card className="gap-0 shadow-xs">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-base font-bold">Gợi ý dành cho bạn</CardTitle>
          <SparklesIcon className="size-4 text-blue-500" />
        </div>
        <p className="text-xs text-muted-foreground">
          {basedOnBooks === 0 ? "Sách phổ biến trong thư viện" : "Dựa trên sách bạn đã mượn"}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {isLoading && <p className="text-sm text-muted-foreground">Đang tải gợi ý...</p>}
          {isError && <p className="text-sm text-muted-foreground">Không thể tải gợi ý sách.</p>}
          {!isLoading && !isError && books.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có sách phù hợp để gợi ý.</p>
          )}
          {books.map((book) => (
            <div
              key={book.id}
              className="group flex items-center gap-3 rounded-lg transition-colors hover:bg-muted/50"
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
                to={`/books/${book.id}`}
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
            "justify-start p-0 text-xs text-blue-600 hover:bg-transparent hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/40"
          )}
        >
          <span>Khám phá thêm sách</span>
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  )
}
