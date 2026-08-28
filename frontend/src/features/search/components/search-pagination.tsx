import { memo } from "react"
import { cn } from "@/lib/utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

interface SearchPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export const SearchPagination = memo(
  ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange
  }: SearchPaginationProps) => {
    if (totalItems === 0) return null

    const startItem = (currentPage - 1) * pageSize + 1
    const endItem = Math.min(currentPage * pageSize, totalItems)

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
      const pages: (number | string)[] = []
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        if (currentPage > 3) pages.push("...")
        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)
        for (let i = start; i <= end; i++) {
          if (!pages.includes(i)) pages.push(i)
        }
        if (currentPage < totalPages - 2) pages.push("...")
        pages.push(totalPages)
      }
      return pages
    }

    return (
      <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border/80 bg-card p-3.5 shadow-xs sm:flex-row sm:px-5">
        {/* Items count summary */}
        <div className="text-[13px] text-muted-foreground">
          Hiển thị <span className="font-semibold text-foreground">{startItem}</span> -{" "}
          <span className="font-semibold text-foreground">{endItem}</span> trong tổng số{" "}
          <span className="font-semibold text-foreground">{totalItems}</span> tài liệu
        </div>

        {/* Pagination Controls */}
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Trước"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) onPageChange(currentPage - 1)
                }}
                aria-disabled={currentPage <= 1}
                className={cn("h-9", currentPage <= 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>

            {getPageNumbers().map((p, idx) => {
              if (p === "...") {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              const pageNum = Number(p)
              const isActive = pageNum === currentPage

              return (
                <PaginationItem key={`page-${pageNum}`}>
                  <PaginationLink
                    isActive={isActive}
                    onClick={(e) => {
                      e.preventDefault()
                      onPageChange(pageNum)
                    }}
                    className="size-9"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                text="Sau"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) onPageChange(currentPage + 1)
                }}
                aria-disabled={currentPage >= totalPages}
                className={cn("h-9", currentPage >= totalPages && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <span>Hiển thị:</span>
          <Select
            items={[]}
            value={String(pageSize)}
            onValueChange={(val) => {
              if (val) onPageSizeChange(Number(val))
            }}
          >
            <SelectTrigger
              size="sm"
              className="h-9! min-w-28 rounded-lg border-border/80 text-[13px] font-medium"
            >
              <SelectValue placeholder="Số lượng" />
            </SelectTrigger>
            <SelectContent align="end" alignItemWithTrigger={false} className="max-w-28!">
              <SelectItem value="12" className="h-9">
                12 / trang
              </SelectItem>
              <SelectItem value="24" className="h-9">
                24 / trang
              </SelectItem>
              <SelectItem value="48" className="h-9">
                48 / trang
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }
)
