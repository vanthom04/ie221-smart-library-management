import { memo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { LayoutGridIcon, ListIcon, XIcon, ArrowUpDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

import { SORT_OPTIONS } from "../constants"
import type { ActiveFilterTag, SortMode, ViewMode } from "../types"

interface SearchToolbarProps {
  query: string
  totalItems: number
  sortBy: SortMode
  viewMode: ViewMode
  activeTags: ActiveFilterTag[]
  onSortChange: (sort: SortMode) => void
  onViewModeChange: (mode: ViewMode) => void
  onRemoveTag: (tag: ActiveFilterTag) => void
  onResetFilters: () => void
}

export const SearchToolbar = memo(
  ({
    query,
    totalItems,
    sortBy,
    viewMode,
    activeTags,
    onSortChange,
    onViewModeChange,
    onRemoveTag,
    onResetFilters
  }: SearchToolbarProps) => {
    return (
      <div className="space-y-3">
        {/* Top Header & Controls */}
        <div className="flex flex-col gap-3 rounded-xl border border-border/80 bg-card p-3 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:px-3">
          {/* Results title & count */}
          <div className="flex items-center gap-2">
            <div>
              <span className="text-sm font-semibold text-foreground sm:text-base">
                {query.trim() ? (
                  <>
                    Kết quả tìm kiếm cho <span className="text-primary">&ldquo;{query}&rdquo;</span>
                  </>
                ) : (
                  "Tất cả tài liệu thư viện"
                )}
              </span>
              <span className="ml-2 text-xs text-muted-foreground sm:text-sm">
                ({totalItems} kết quả)
              </span>
            </div>
          </div>

          {/* Right Tools: Sort Dropdown & View Mode */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="hidden items-center gap-1 text-[13px] text-muted-foreground sm:inline-flex">
                <ArrowUpDownIcon className="size-3.5" /> Sắp xếp:
              </span>
              <Select
                value={sortBy}
                items={SORT_OPTIONS}
                onValueChange={(val) => {
                  if (val) onSortChange(val as SortMode)
                }}
              >
                <SelectTrigger
                  size="sm"
                  className="h-9! min-w-36 rounded-xl border-border/80 bg-background px-4 text-[13px] font-medium"
                >
                  <SelectValue placeholder="Chọn thứ tự" />
                </SelectTrigger>
                <SelectContent align="end" alignItemWithTrigger={false}>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="h-9">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center rounded-lg border border-border/80 bg-muted/30 p-1">
              <Button
                type="button"
                size="icon-sm"
                title="Chế độ lưới"
                className="size-7 rounded-md"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => onViewModeChange("grid")}
              >
                <LayoutGridIcon className="size-3.5" />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                title="Chế độ danh sách"
                className="size-7 rounded-md"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => onViewModeChange("list")}
              >
                <ListIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filter Tags Quick Bar (if any) */}
        <AnimatePresence>
          {activeTags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-1.5 px-1 text-xs"
            >
              <span className="font-medium text-muted-foreground">Bộ lọc đang chọn:</span>
              <AnimatePresence mode="popLayout">
                {activeTags.map((tag) => (
                  <motion.span
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                  >
                    {tag.label}
                    <button
                      type="button"
                      onClick={() => onRemoveTag(tag)}
                      className="cursor-pointer text-primary/70 hover:text-primary"
                    >
                      <XIcon className="size-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={onResetFilters}
                className="ml-1 cursor-pointer text-xs font-semibold text-destructive hover:underline"
              >
                Xóa tất cả
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)
