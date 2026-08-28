import { memo } from "react"
import { motion } from "motion/react"
import {
  BookmarkIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
  CoinsIcon,
  FootprintsIcon,
  HourglassIcon,
  PieChartIcon,
  StickyNoteIcon,
  MonitorIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { CATEGORY_TONE_STYLES } from "../constants"
import type { BookItem } from "../types"

interface BookCardGridProps {
  book: BookItem
  onSelectBook: (book: BookItem) => void
  onToggleBookmark: (bookId: string) => void
  onActionClick: (book: BookItem, action: "borrow" | "reserve") => void
}

const renderCoverIcon = (iconName?: string) => {
  switch (iconName) {
    case "Clock":
      return <ClockIcon className="size-8 stroke-[1.5]" />
    case "Footprints":
      return <FootprintsIcon className="size-8 stroke-[1.5]" />
    case "Hourglass":
      return <HourglassIcon className="size-8 stroke-[1.5]" />
    case "Sparkles":
      return <SparklesIcon className="size-8 stroke-[1.5]" />
    case "Coins":
      return <CoinsIcon className="size-8 stroke-[1.5]" />
    case "StickyNote":
      return <StickyNoteIcon className="size-8 stroke-[1.5]" />
    case "Monitor":
      return <MonitorIcon className="size-8 stroke-[1.5]" />
    case "PieChart":
      return <PieChartIcon className="size-8 stroke-[1.5]" />
    default:
      return <BookOpenIcon className="size-8 stroke-[1.5]" />
  }
}

export const BookCardGrid = memo(
  ({ book, onSelectBook, onToggleBookmark, onActionClick }: BookCardGridProps) => {
    const isAvailable = book.availableCount > 0
    const tone = CATEGORY_TONE_STYLES[book.categoryTone] || CATEGORY_TONE_STYLES.blue

    return (
      <Card className="group flex h-full flex-col overflow-hidden rounded-xl border-border/80 p-0 shadow-xs transition-[box-shadow,border-color] duration-200 hover:border-primary/40 hover:shadow-md">
        <CardContent className="flex flex-1 flex-col px-0">
          {/* Top Cover Banner */}
          <div
            onClick={() => onSelectBook(book)}
            className={cn(
              "relative flex aspect-16/12 w-full cursor-pointer flex-col justify-between bg-linear-to-br p-3.5 text-center transition-transform group-hover:brightness-105",
              book.cover.gradient,
              book.cover.textClass
            )}
          >
            {/* Top bar inside cover */}
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-black/20 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase backdrop-blur-xs">
                {book.category}
              </span>
              <motion.button
                type="button"
                whileTap={{ scale: 0.82 }}
                whileHover={{ scale: 1.15 }}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleBookmark(book.id)
                }}
                className={cn(
                  "cursor-pointer rounded-full p-1.75 backdrop-blur-xs transition-colors",
                  book.isBookmarked
                    ? "bg-amber-400 text-amber-950"
                    : "bg-black/20 text-white/80 hover:text-white"
                )}
                title={book.isBookmarked ? "Bỏ lưu sách" : "Lưu vào danh sách đọc"}
              >
                <BookmarkIcon className={cn("size-4", book.isBookmarked && "fill-current")} />
              </motion.button>
            </div>

            {/* Center cover title & icon */}
            <div className="my-auto flex flex-col items-center justify-center">
              <div className="mb-1 opacity-80">{renderCoverIcon(book.cover.iconName)}</div>
              <div className="leading-tight">
                {book.cover.titleLines.map((line, idx) => (
                  <p key={idx} className="text-xs font-black tracking-tight uppercase sm:text-sm">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Bottom author on cover */}
            <div className="truncate text-[10px] font-medium opacity-80">{book.author}</div>
          </div>

          {/* Book Information Body */}
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="flex items-center justify-between gap-1">
                <Badge
                  variant="outline"
                  className={cn("px-1.5 py-0 text-[10px] font-medium", tone.badge)}
                >
                  {book.category}
                </Badge>
              </div>

              <h4
                onClick={() => onSelectBook(book)}
                className="mt-2 line-clamp-2 cursor-pointer text-sm leading-snug font-bold text-foreground transition-colors hover:text-primary"
                title={book.title}
              >
                {book.title}
              </h4>

              <p className="mt-1 truncate text-xs text-muted-foreground">
                {book.author} • {book.publishYear}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="mt-4 border-t border-border/60 pt-3">
              <div className="flex items-center justify-between gap-2">
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
                    ? `Còn ${book.availableCount}/${book.totalCount} cuốn`
                    : "Hết sẵn có"}
                </span>

                <Button
                  type="button"
                  size="sm"
                  variant={isAvailable ? "default" : "secondary"}
                  onClick={() => onActionClick(book, isAvailable ? "borrow" : "reserve")}
                  className={cn(
                    "h-8 px-3 text-xs",
                    !isAvailable &&
                      "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                  )}
                >
                  {isAvailable ? "Mượn ngay" : "Đặt trước"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)
