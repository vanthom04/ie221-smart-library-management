import { FilterIcon, XIcon, RotateCcwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { SearchFilterSidebar } from "./search-filter-sidebar"
import type { ActiveFilterTag, AvailabilityStatus, SearchFilterState } from "../types"

interface SearchFilterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  state: SearchFilterState
  activeTags: ActiveFilterTag[]
  totalItems: number
  onToggleStatus: (status: AvailabilityStatus) => void
  onToggleCategory: (category: string) => void
  onToggleAuthor: (author: string) => void
  onTogglePublisher: (publisher: string) => void
  onToggleLanguage: (language: string) => void
  onSetYearRange: (range: [number, number]) => void
  onResetFilters: () => void
  onRemoveTag: (tag: ActiveFilterTag) => void
}

export const SearchFilterDrawer = ({
  open,
  onOpenChange,
  state,
  activeTags,
  totalItems,
  onToggleStatus,
  onToggleCategory,
  onToggleAuthor,
  onTogglePublisher,
  onToggleLanguage,
  onSetYearRange,
  onResetFilters,
  onRemoveTag
}: SearchFilterDrawerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] max-w-md overflow-hidden p-0 sm:max-w-lg"
      >
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border/80 px-5 py-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="size-4 text-primary" />
            <DialogTitle className="text-base font-bold">Bộ lọc tìm kiếm</DialogTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-full"
          >
            <XIcon className="size-4" />
          </Button>
        </DialogHeader>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto px-5 py-3">
          <SearchFilterSidebar
            state={state}
            activeTags={activeTags}
            onToggleStatus={onToggleStatus}
            onToggleCategory={onToggleCategory}
            onToggleAuthor={onToggleAuthor}
            onTogglePublisher={onTogglePublisher}
            onToggleLanguage={onToggleLanguage}
            onSetYearRange={onSetYearRange}
            onResetFilters={onResetFilters}
            onRemoveTag={onRemoveTag}
          />
        </div>

        <div className="flex items-center justify-between border-t border-border/80 bg-muted/40 px-5 py-3.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            disabled={activeTags.length === 0}
            className="text-xs text-destructive hover:bg-destructive/10"
          >
            <RotateCcwIcon className="mr-1 size-3" /> Đặt lại tất cả
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-5 text-xs font-semibold"
          >
            Xem {totalItems} kết quả
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
