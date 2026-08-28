import { memo } from "react"
import { SearchXIcon, RotateCcwIcon, SparklesIcon } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent
} from "@/components/ui/empty"

import { SUGGESTED_KEYWORDS } from "../constants"

interface SearchEmptyStateProps {
  query: string
  hasFilters: boolean
  onResetFilters: () => void
  onSelectKeyword: (keyword: string) => void
}

export const SearchEmptyState = memo(
  ({ query, hasFilters, onResetFilters, onSelectKeyword }: SearchEmptyStateProps) => {
    return (
      <Empty className="rounded-2xl border-2 border-dashed border-border/80 bg-card/60 p-8 sm:p-12">
        <EmptyHeader>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <EmptyMedia
              variant="icon"
              className="size-16 rounded-2xl bg-muted text-muted-foreground shadow-2xs"
            >
              <SearchXIcon className="size-8" />
            </EmptyMedia>
          </motion.div>
          <EmptyTitle className="text-base font-bold text-foreground sm:text-lg">
            Không tìm thấy sách phù hợp
          </EmptyTitle>
          <EmptyDescription className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {query ? (
              <>
                Không có kết quả nào khớp với từ khóa{" "}
                <span className="font-semibold text-foreground">&ldquo;{query}&rdquo;</span> hoặc
                các bộ lọc đã chọn.
              </>
            ) : (
              "Không có tài liệu nào thỏa mãn các tiêu chí lọc hiện tại."
            )}
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="max-w-md">
          {hasFilters && (
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                type="button"
                variant="default"
                onClick={onResetFilters}
                className="cursor-pointer rounded-xl text-xs font-semibold"
              >
                <RotateCcwIcon className="mr-1.5 size-3.5" /> Xóa tất cả bộ lọc
              </Button>
            </motion.div>
          )}

          {/* Suggested Searches */}
          <div className="mt-4 w-full border-t border-border/60 pt-5">
            <span className="block text-center text-xs font-medium text-muted-foreground">
              Thử tìm kiếm với các chủ đề phổ biến:
            </span>
            <div className="mt-2.5 flex flex-wrap justify-center gap-2">
              {SUGGESTED_KEYWORDS.slice(0, 4).map((kw) => (
                <motion.button
                  key={kw.label}
                  type="button"
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectKeyword(kw.label)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-border/80 bg-background px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                >
                  <SparklesIcon className="size-3 text-primary" />
                  {kw.label}
                </motion.button>
              ))}
            </div>
          </div>
        </EmptyContent>
      </Empty>
    )
  }
)
