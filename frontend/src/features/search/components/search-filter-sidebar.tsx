import { useState, useMemo, memo } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  XIcon,
  ChevronUpIcon,
  FilterIcon,
  RotateCcwIcon,
  SearchIcon,
  ChevronDownIcon
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import {
  MIN_YEAR,
  MAX_YEAR,
  CATEGORY_FILTERS,
  AUTHOR_FILTERS,
  PUBLISHER_FILTERS,
  STATUS_OPTIONS,
  LANGUAGE_OPTIONS
} from "../constants"
import type { ActiveFilterTag, AvailabilityStatus, SearchFilterState } from "../types"

interface SearchFilterSidebarProps {
  state: SearchFilterState
  activeTags: ActiveFilterTag[]
  onToggleStatus: (status: AvailabilityStatus) => void
  onToggleCategory: (category: string) => void
  onToggleAuthor: (author: string) => void
  onTogglePublisher: (publisher: string) => void
  onToggleLanguage: (language: string) => void
  onSetYearRange: (range: [number, number]) => void
  onResetFilters: () => void
  onRemoveTag: (tag: ActiveFilterTag) => void
}

interface FilterSectionProps {
  title: string
  isOpenDefault?: boolean
  children: React.ReactNode
  showSeparator?: boolean
}

const FilterSection = ({
  title,
  isOpenDefault = true,
  children,
  showSeparator = true
}: FilterSectionProps) => {
  const [open, setOpen] = useState(isOpenDefault)

  return (
    <div>
      <Collapsible open={open} onOpenChange={setOpen} className="py-3.5 first:pt-0 last:pb-0">
        <CollapsibleTrigger className="group flex w-full cursor-pointer items-center justify-between py-1 text-left select-none">
          <h4 className="text-xs font-bold tracking-wider text-foreground/90 uppercase transition-colors group-hover:text-primary">
            {title}
          </h4>
          <span className="text-muted-foreground transition-transform duration-200">
            {open ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2.5 space-y-2">{children}</CollapsibleContent>
      </Collapsible>
      {showSeparator && <Separator className="bg-border/60" />}
    </div>
  )
}

export const SearchFilterSidebar = memo(
  ({
    state,
    activeTags,
    onToggleStatus,
    onToggleCategory,
    onToggleAuthor,
    onTogglePublisher,
    onToggleLanguage,
    onSetYearRange,
    onResetFilters,
    onRemoveTag
  }: SearchFilterSidebarProps) => {
    // Category section search & show more
    const [categorySearch, setCategorySearch] = useState("")
    const [showAllCategories, setShowAllCategories] = useState(false)

    // Author section search & show more
    const [authorSearch, setAuthorSearch] = useState("")
    const [showAllAuthors, setShowAllAuthors] = useState(false)

    // Year local inputs
    const [prevYearRange, setPrevYearRange] = useState(state.yearRange)
    const [localMinYear, setLocalMinYear] = useState<number>(state.yearRange[0])
    const [localMaxYear, setLocalMaxYear] = useState<number>(state.yearRange[1])

    if (state.yearRange[0] !== prevYearRange[0] || state.yearRange[1] !== prevYearRange[1]) {
      setPrevYearRange(state.yearRange)
      setLocalMinYear(state.yearRange[0])
      setLocalMaxYear(state.yearRange[1])
    }

    const filteredCategories = useMemo(() => {
      let list = CATEGORY_FILTERS
      if (categorySearch.trim()) {
        const q = categorySearch.toLowerCase().trim()
        list = list.filter((c) => c.label.toLowerCase().includes(q))
      }
      if (!showAllCategories && !categorySearch.trim()) {
        return list.slice(0, 5)
      }
      return list
    }, [categorySearch, showAllCategories])

    const filteredAuthors = useMemo(() => {
      let list = AUTHOR_FILTERS
      if (authorSearch.trim()) {
        const q = authorSearch.toLowerCase().trim()
        list = list.filter((a) => a.label.toLowerCase().includes(q))
      }
      if (!showAllAuthors && !authorSearch.trim()) {
        return list.slice(0, 4)
      }
      return list
    }, [authorSearch, showAllAuthors])

    const handleApplyYear = () => {
      const min = Math.min(Math.max(MIN_YEAR, localMinYear || MIN_YEAR), localMaxYear || MAX_YEAR)
      const max = Math.max(Math.min(MAX_YEAR, localMaxYear || MAX_YEAR), min)
      onSetYearRange([min, max])
    }

    const hasActiveFilters = activeTags.length > 0

    return (
      <Card className="no-scrollbar max-h-[calc(100vh-5rem)] overflow-y-auto border-border/80 p-0">
        <CardContent className="p-4.5">
          {/* Header */}
          <div className="top-0 z-10 mb-1 flex items-center justify-between border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <FilterIcon className="size-4 text-primary" />
              <h3 className="text-sm font-bold text-foreground">Bộ lọc tìm kiếm</h3>
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="h-5 rounded-full px-1.5 text-[11px] font-semibold text-primary"
                >
                  {activeTags.length}
                </Badge>
              )}
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="flex cursor-pointer items-center gap-1 text-xs font-medium text-destructive hover:underline"
              >
                <RotateCcwIcon className="size-3" /> Đặt lại
              </button>
            )}
          </div>

          {/* Active Filter Tags */}
          <AnimatePresence>
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="border-b border-border/60 py-3"
              >
                <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                  <span>Đang lọc theo:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <AnimatePresence mode="popLayout">
                    {activeTags.map((tag) => (
                      <motion.span
                        key={tag.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filter Sections */}
          <div className="space-y-1 pt-1">
            {/* Availability Status */}
            <FilterSection title="Tình trạng tài liệu" isOpenDefault>
              <div className="space-y-2">
                {STATUS_OPTIONS.map((status) => {
                  const isChecked = state.statuses.includes(status.id)
                  return (
                    <div key={status.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status.id}`}
                        checked={isChecked}
                        onCheckedChange={() => onToggleStatus(status.id)}
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={`status-${status.id}`}
                        className="cursor-pointer text-xs font-normal text-foreground/80 hover:text-foreground"
                      >
                        {status.label}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </FilterSection>

            {/* Categories */}
            <FilterSection title="Danh mục / Thể loại" isOpenDefault>
              <div className="relative mb-2">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Tìm thể loại..."
                  className="h-7.5 rounded-lg border-border/80 pl-7 text-xs"
                />
              </div>
              <div className="space-y-2">
                {filteredCategories.map((cat) => {
                  const isChecked = state.categories.includes(cat.label)
                  return (
                    <div key={cat.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${cat.id}`}
                          checked={isChecked}
                          onCheckedChange={() => onToggleCategory(cat.label)}
                          className="cursor-pointer"
                        />
                        <Label
                          htmlFor={`cat-${cat.id}`}
                          className="line-clamp-1 cursor-pointer text-xs font-normal text-foreground/80 hover:text-foreground"
                        >
                          {cat.label}
                        </Label>
                      </div>
                      <span className="text-[11px] text-muted-foreground">({cat.count})</span>
                    </div>
                  )
                })}
                {CATEGORY_FILTERS.length > 5 && !categorySearch && (
                  <button
                    type="button"
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="cursor-pointer text-xs font-semibold text-primary hover:underline"
                  >
                    {showAllCategories ? "Thu gọn" : `+ Xem thêm (${CATEGORY_FILTERS.length - 5})`}
                  </button>
                )}
              </div>
            </FilterSection>

            {/* Authors */}
            <FilterSection title="Tác giả" isOpenDefault>
              <div className="relative mb-2">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-3 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={authorSearch}
                  onChange={(e) => setAuthorSearch(e.target.value)}
                  placeholder="Tìm tác giả..."
                  className="h-7.5 rounded-lg border-border/80 pl-7 text-xs"
                />
              </div>
              <div className="space-y-2">
                {filteredAuthors.map((author) => {
                  const isChecked = state.authors.includes(author.label)
                  return (
                    <div key={author.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`author-${author.id}`}
                          checked={isChecked}
                          onCheckedChange={() => onToggleAuthor(author.label)}
                          className="cursor-pointer"
                        />
                        <Label
                          htmlFor={`author-${author.id}`}
                          className="line-clamp-1 cursor-pointer text-xs font-normal text-foreground/80 hover:text-foreground"
                        >
                          {author.label}
                        </Label>
                      </div>
                      <span className="text-[11px] text-muted-foreground">({author.count})</span>
                    </div>
                  )
                })}
                {AUTHOR_FILTERS.length > 4 && !authorSearch && (
                  <button
                    type="button"
                    onClick={() => setShowAllAuthors(!showAllAuthors)}
                    className="cursor-pointer text-xs font-semibold text-primary hover:underline"
                  >
                    {showAllAuthors ? "Thu gọn" : `+ Xem thêm (${AUTHOR_FILTERS.length - 4})`}
                  </button>
                )}
              </div>
            </FilterSection>

            {/* Publishers */}
            <FilterSection title="Nhà xuất bản" isOpenDefault={false}>
              <div className="space-y-2">
                {PUBLISHER_FILTERS.map((pub) => {
                  const isChecked = state.publishers.includes(pub.label)
                  return (
                    <div key={pub.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`pub-${pub.id}`}
                          checked={isChecked}
                          onCheckedChange={() => onTogglePublisher(pub.label)}
                          className="cursor-pointer"
                        />
                        <Label
                          htmlFor={`pub-${pub.id}`}
                          className="line-clamp-1 cursor-pointer text-xs font-normal text-foreground/80 hover:text-foreground"
                        >
                          {pub.label}
                        </Label>
                      </div>
                      <span className="text-[11px] text-muted-foreground">({pub.count})</span>
                    </div>
                  )
                })}
              </div>
            </FilterSection>

            {/* Publication Year */}
            <FilterSection title="Năm xuất bản" isOpenDefault={false}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    value={localMinYear}
                    onChange={(e) => setLocalMinYear(Number(e.target.value))}
                    className="h-8 rounded-lg text-center text-xs"
                    placeholder={MIN_YEAR.toString()}
                  />
                  <span className="text-muted-foreground">–</span>
                  <Input
                    type="number"
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    value={localMaxYear}
                    onChange={(e) => setLocalMaxYear(Number(e.target.value))}
                    className="h-8 rounded-lg text-center text-xs"
                    placeholder={MAX_YEAR.toString()}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleApplyYear}
                    className="h-8 px-2.5 text-xs font-medium"
                  >
                    Lọc
                  </Button>
                </div>
                <Slider
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  step={1}
                  value={[localMinYear, localMaxYear]}
                  onValueChange={(val) => {
                    const values = val as number[]
                    if (Array.isArray(values) && values.length >= 2) {
                      setLocalMinYear(values[0])
                      setLocalMaxYear(values[1])
                    }
                  }}
                  className="py-2"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{MIN_YEAR}</span>
                  <span>{MAX_YEAR}</span>
                </div>
              </div>
            </FilterSection>

            {/* Language */}
            <FilterSection title="Ngôn ngữ" isOpenDefault={false} showSeparator={false}>
              <div className="space-y-2">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isChecked = state.languages.includes(lang.label)
                  return (
                    <div key={lang.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`lang-${lang.id}`}
                          checked={isChecked}
                          onCheckedChange={() => onToggleLanguage(lang.label)}
                          className="cursor-pointer"
                        />
                        <Label
                          htmlFor={`lang-${lang.id}`}
                          className="cursor-pointer text-xs font-normal text-foreground/80 hover:text-foreground"
                        >
                          {lang.label}
                        </Label>
                      </div>
                      <span className="text-[11px] text-muted-foreground">({lang.count})</span>
                    </div>
                  )
                })}
              </div>
            </FilterSection>
          </div>
        </CardContent>
      </Card>
    )
  }
)
