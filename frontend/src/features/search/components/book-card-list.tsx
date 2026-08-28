import { memo } from "react"
import { motion } from "motion/react"
import { BookmarkIcon, BookOpenIcon, InfoIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { CATEGORY_TONE_STYLES } from "../constants"
import type { BookItem } from "../types"

interface BookCardListProps {
  book: BookItem
  onSelectBook: (book: BookItem) => void
  onToggleBookmark: (bookId: string) => void
  onActionClick: (book: BookItem, action: "borrow" | "reserve") => void
}

export const BookCardList = memo(
  ({ book, onSelectBook, onToggleBookmark, onActionClick }: BookCardListProps) => {
    const isAvailable = book.availableCount > 0
    const tone = CATEGORY_TONE_STYLES[book.categoryTone] || CATEGORY_TONE_STYLES.blue

    return (
      <Card className="group flex flex-col overflow-hidden rounded-2xl border-border/80 bg-card p-0 shadow-xs transition-[box-shadow,border-color] duration-200 hover:border-primary/40 hover:shadow-md sm:flex-row">
        {/* Left Thumbnail Banner */}
        <div
          onClick={() => onSelectBook(book)}
          className={cn(
            "relative flex h-36 shrink-0 cursor-pointer flex-col justify-between bg-linear-to-br p-3 text-center transition-all group-hover:brightness-105 sm:h-auto sm:w-36",
            book.cover.gradient,
            book.cover.textClass
          )}
        >
          <span className="mx-auto rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase backdrop-blur-xs">
            {book.category}
          </span>

          <div className="my-auto text-center">
            <BookOpenIcon className="mx-auto mb-1 size-6 opacity-80" />
            <p className="line-clamp-2 text-[11px] font-black uppercase">{book.title}</p>
          </div>

          <p className="truncate text-[9px] font-medium opacity-80">{book.author}</p>
        </div>

        {/* Right Content Area */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div>
            {/* Header Row: Title & Bookmark */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("px-2 py-0 text-[10px] font-medium", tone.badge)}
                  >
                    {book.category}
                  </Badge>
                  {book.isEbookAvailable && (
                    <span className="rounded-md border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">
                      E-book
                    </span>
                  )}
                </div>

                <h4
                  onClick={() => onSelectBook(book)}
                  className="cursor-pointer text-base leading-snug font-bold text-foreground transition-colors hover:text-primary"
                >
                  {book.title}
                </h4>

                <p className="mt-1 text-xs text-muted-foreground">
                  Tác giả: <span className="font-semibold text-foreground">{book.author}</span> •
                  NXB: {book.publisher} • Năm: {book.publishYear} • ISBN: {book.isbn}
                </p>
              </div>

              <motion.button
                type="button"
                whileTap={{ scale: 0.82 }}
                whileHover={{ scale: 1.12 }}
                onClick={() => onToggleBookmark(book.id)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full border p-2 transition-colors",
                  book.isBookmarked
                    ? "border-amber-300 bg-amber-50 text-amber-600"
                    : "border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={book.isBookmarked ? "Bỏ lưu sách" : "Lưu vào danh sách đọc"}
              >
                <BookmarkIcon className={cn("size-4", book.isBookmarked && "fill-current")} />
              </motion.button>
            </div>

            {/* Description Snippet */}
            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-foreground/80">
              {book.description}
            </p>
          </div>

          {/* Bottom Bar: Location, Status & Action Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
            <div className="flex flex-wrap items-center gap-3">
              {/* Availability */}
              <span
                className={cn(
                  "flex items-center gap-1.5 text-xs font-semibold",
                  isAvailable ? "text-emerald-600" : "text-amber-600"
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    isAvailable ? "bg-emerald-500" : "animate-pulse bg-amber-500"
                  )}
                />
                {isAvailable
                  ? `Còn ${book.availableCount} / ${book.totalCount} cuốn`
                  : "Hết sẵn có (Cho phép đặt trước)"}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onSelectBook(book)}
                className="h-8 rounded-xl px-3 text-xs font-medium"
              >
                <InfoIcon className="mr-1 size-3.5" /> Chi tiết
              </Button>

              <Button
                type="button"
                size="sm"
                variant={isAvailable ? "default" : "secondary"}
                onClick={() => onActionClick(book, isAvailable ? "borrow" : "reserve")}
                className={cn(
                  "h-8 rounded-xl px-4 text-xs font-semibold",
                  !isAvailable &&
                    "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                )}
              >
                {isAvailable ? "Mượn ngay" : "Đặt trước"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }
)
