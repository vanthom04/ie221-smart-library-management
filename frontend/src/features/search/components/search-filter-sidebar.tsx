import { useState } from "react"
import { m, AnimatePresence } from "motion/react"
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

interface SearchFilterHeaderProps {
  hasActiveFilters: boolean
  activeCount: number
  onResetFilters: () => void
}

const SearchFilterHeader = ({
  hasActiveFilters,
  activeCount,
  onResetFilters
}: SearchFilterHeaderProps) => (
  <div className="top-0 z-10 mb-1 flex items-center justify-between border-b border-border/60 pb-4">
    <div className="flex items-center gap-2">
      <FilterIcon className="size-4 text-primary" />
      <h3 className="text-sm font-bold text-foreground">Bộ lọc tìm kiếm</h3>
      {hasActiveFilters && (
        <Badge
          variant="secondary"
          className="h-5 rounded-full px-1.5 text-[11px] font-semibold text-primary"
        >
          {activeCount}
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
)

interface ActiveFilterTagsSectionProps {
  activeTags: ActiveFilterTag[]
  onRemoveTag: (tag: ActiveFilterTag) => void
}

const ActiveFilterTagsSection = ({ activeTags, onRemoveTag }: ActiveFilterTagsSectionProps) => {
  if (activeTags.length === 0) return null

  return (
    <AnimatePresence>
      <m.div
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
              <m.span
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
                  aria-label={`Xóa bộ lọc ${tag.label}`}
                  className="cursor-pointer text-primary/70 hover:text-primary"
                >
                  <XIcon className="size-3" />
                </button>
              </m.span>
            ))}
          </AnimatePresence>
        </div>
      </m.div>
    </AnimatePresence>
  )
}

interface StatusFilterProps {
  statusSet: Set<AvailabilityStatus>
  onToggleStatus: (status: AvailabilityStatus) => void
}

const StatusFilter = ({ statusSet, onToggleStatus }: StatusFilterProps) => (
  <FilterSection title="Tình trạng tài liệu" isOpenDefault>
    <div className="space-y-2">
      {STATUS_OPTIONS.map((status) => {
        const isChecked = statusSet.has(status.id)
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
)

interface CategoryFilterProps {
  categorySet: Set<string>
  onToggleCategory: (category: string) => void
}

interface CountedFilterOptionRowProps {
  checked: boolean
  checkboxId: string
  count: number
  label: string
  labelClassName?: string
  onCheckedChange: () => void
}

const CountedFilterOptionRow = ({
  checked,
  checkboxId,
  count,
  label,
  labelClassName = "line-clamp-1",
  onCheckedChange
}: CountedFilterOptionRowProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <Checkbox
        id={checkboxId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="cursor-pointer"
      />
      <Label
        htmlFor={checkboxId}
        className={`${labelClassName} cursor-pointer text-xs font-normal text-foreground/80 hover:text-foreground`}
      >
        {label}
      </Label>
    </div>
    <span className="text-[11px] text-muted-foreground">({count})</span>
  </div>
)

const CategoryFilter = ({ categorySet, onToggleCategory }: CategoryFilterProps) => {
  const [categorySearch, setCategorySearch] = useState("")
  const [showAllCategories, setShowAllCategories] = useState(false)

  let filteredCategories = CATEGORY_FILTERS
  if (categorySearch.trim()) {
    const q = categorySearch.toLowerCase().trim()
    filteredCategories = filteredCategories.filter((c) => c.label.toLowerCase().includes(q))
  }
  if (!showAllCategories && !categorySearch.trim()) {
    filteredCategories = filteredCategories.slice(0, 5)
  }

  return (
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
          const isChecked = categorySet.has(cat.label)
          return (
            <CountedFilterOptionRow
              key={cat.id}
              checkboxId={`cat-${cat.id}`}
              checked={isChecked}
              count={cat.count}
              label={cat.label}
              onCheckedChange={() => onToggleCategory(cat.label)}
            />
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
  )
}

interface AuthorFilterProps {
  authorSet: Set<string>
  onToggleAuthor: (author: string) => void
}

const AuthorFilter = ({ authorSet, onToggleAuthor }: AuthorFilterProps) => {
  const [authorSearch, setAuthorSearch] = useState("")
  const [showAllAuthors, setShowAllAuthors] = useState(false)

  let filteredAuthors = AUTHOR_FILTERS
  if (authorSearch.trim()) {
    const q = authorSearch.toLowerCase().trim()
    filteredAuthors = filteredAuthors.filter((a) => a.label.toLowerCase().includes(q))
  }
  if (!showAllAuthors && !authorSearch.trim()) {
    filteredAuthors = filteredAuthors.slice(0, 4)
  }

  return (
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
          const isChecked = authorSet.has(author.label)
          return (
            <CountedFilterOptionRow
              key={author.id}
              checkboxId={`author-${author.id}`}
              checked={isChecked}
              count={author.count}
              label={author.label}
              onCheckedChange={() => onToggleAuthor(author.label)}
            />
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
  )
}

interface PublisherFilterProps {
  publisherSet: Set<string>
  onTogglePublisher: (publisher: string) => void
}

const PublisherFilter = ({ publisherSet, onTogglePublisher }: PublisherFilterProps) => (
  <FilterSection title="Nhà xuất bản" isOpenDefault={false}>
    <div className="space-y-2">
      {PUBLISHER_FILTERS.map((pub) => {
        const isChecked = publisherSet.has(pub.label)
        return (
          <CountedFilterOptionRow
            key={pub.id}
            checkboxId={`pub-${pub.id}`}
            checked={isChecked}
            count={pub.count}
            label={pub.label}
            onCheckedChange={() => onTogglePublisher(pub.label)}
          />
        )
      })}
    </div>
  </FilterSection>
)

interface YearFilterProps {
  yearRange: [number, number]
  onSetYearRange: (range: [number, number]) => void
}

const YearFilter = ({ yearRange, onSetYearRange }: YearFilterProps) => {
  const [prevYearRange, setPrevYearRange] = useState(yearRange)
  const [localMinYear, setLocalMinYear] = useState<number>(yearRange[0])
  const [localMaxYear, setLocalMaxYear] = useState<number>(yearRange[1])

  if (yearRange[0] !== prevYearRange[0] || yearRange[1] !== prevYearRange[1]) {
    setPrevYearRange(yearRange)
    setLocalMinYear(yearRange[0])
    setLocalMaxYear(yearRange[1])
  }

  const handleApplyYear = () => {
    const min = Math.min(Math.max(MIN_YEAR, localMinYear || MIN_YEAR), localMaxYear || MAX_YEAR)
    const max = Math.max(Math.min(MAX_YEAR, localMaxYear || MAX_YEAR), min)
    onSetYearRange([min, max])
  }

  return (
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
  )
}

interface LanguageFilterProps {
  languageSet: Set<string>
  onToggleLanguage: (language: string) => void
}

const LanguageFilter = ({ languageSet, onToggleLanguage }: LanguageFilterProps) => (
  <FilterSection title="Ngôn ngữ" isOpenDefault={false} showSeparator={false}>
    <div className="space-y-2">
      {LANGUAGE_OPTIONS.map((lang) => {
        const isChecked = languageSet.has(lang.label)
        return (
          <CountedFilterOptionRow
            key={lang.id}
            checkboxId={`lang-${lang.id}`}
            checked={isChecked}
            count={lang.count}
            label={lang.label}
            labelClassName=""
            onCheckedChange={() => onToggleLanguage(lang.label)}
          />
        )
      })}
    </div>
  </FilterSection>
)

export const SearchFilterSidebar = ({
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
  const hasActiveFilters = activeTags.length > 0

  const statusSet = new Set(state.statuses)
  const categorySet = new Set(state.categories)
  const authorSet = new Set(state.authors)
  const publisherSet = new Set(state.publishers)
  const languageSet = new Set(state.languages)

  return (
    <Card className="no-scrollbar max-h-[calc(100vh-5rem)] overflow-y-auto border-border/80 p-0">
      <CardContent className="p-4.5">
        {/* Header */}
        <SearchFilterHeader
          hasActiveFilters={hasActiveFilters}
          activeCount={activeTags.length}
          onResetFilters={onResetFilters}
        />

        {/* Active Filter Tags */}
        <ActiveFilterTagsSection activeTags={activeTags} onRemoveTag={onRemoveTag} />

        {/* Filter Sections */}
        <div className="space-y-1 pt-1">
          <StatusFilter statusSet={statusSet} onToggleStatus={onToggleStatus} />
          <CategoryFilter categorySet={categorySet} onToggleCategory={onToggleCategory} />
          <AuthorFilter authorSet={authorSet} onToggleAuthor={onToggleAuthor} />
          <PublisherFilter publisherSet={publisherSet} onTogglePublisher={onTogglePublisher} />
          <YearFilter yearRange={state.yearRange} onSetYearRange={onSetYearRange} />
          <LanguageFilter languageSet={languageSet} onToggleLanguage={onToggleLanguage} />
        </div>
      </CardContent>
    </Card>
  )
}
