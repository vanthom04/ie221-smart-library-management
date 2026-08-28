import { useState, memo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { motion, AnimatePresence } from "motion/react"
import {
  SparklesIcon,
  SearchIcon,
  FilterIcon,
  XCircleIcon,
  SlidersHorizontalIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { SUGGESTED_KEYWORDS } from "../constants"
import { searchBarSchema, type SearchBarValues } from "../schemas"

interface SearchBarSectionProps {
  query: string
  activeFiltersCount: number
  onSearch: (query: string) => void
  onOpenMobileFilter?: () => void
}

export const SearchBarSection = memo(
  ({ query, activeFiltersCount, onSearch, onOpenMobileFilter }: SearchBarSectionProps) => {
    const [prevQuery, setPrevQuery] = useState(query)

    const form = useForm<SearchBarValues>({
      resolver: zodResolver(searchBarSchema),
      defaultValues: {
        q: query
      }
    })

    const currentQ = useWatch({ control: form.control, name: "q" })

    // Synchronize form when query changes from external sources (URL/breadcrumbs/reset)
    if (query !== prevQuery) {
      setPrevQuery(query)
      form.reset({ q: query })
    }

    const onSubmit = (values: SearchBarValues) => {
      onSearch(values.q ?? "")
    }

    const handleClear = () => {
      form.setValue("q", "")
      onSearch("")
    }

    const handleSelectKeyword = (keyword: string) => {
      form.setValue("q", keyword)
      onSearch(keyword)
    }

    return (
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Input Form */}
          <form
            id="form-search"
            onSubmit={form.handleSubmit(onSubmit)}
            className="relative flex-1 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs transition-all duration-200 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20"
          >
            <SparklesIcon className="pointer-events-none absolute top-1/2 left-4 size-5 shrink-0 -translate-y-1/2 text-primary" />

            <Controller
              control={form.control}
              name="q"
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="search-input"
                  name={field.name}
                  autoComplete="off"
                  placeholder="Nhập tên sách, tác giả, thể loại, ISBN..."
                  className="h-13 border-0 bg-transparent pr-28 pl-12 text-sm shadow-none sm:text-[15px]"
                  aria-invalid={fieldState.invalid}
                />
              )}
            />

            <AnimatePresence>
              {currentQ.trim().length > 0 && (
                <motion.button
                  type="button"
                  title="Xóa từ khóa"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="absolute top-1/2 right-33 -translate-y-1/2 p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <XCircleIcon className="size-4" />
                </motion.button>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              form="form-search"
              className="absolute top-1/2 right-2 h-auto shrink-0 -translate-y-1/2 rounded-lg px-4 py-2 text-xs font-medium active:not-aria-[haspopup]:-translate-y-1/2 sm:text-sm"
            >
              <SearchIcon /> Tìm kiếm
            </Button>
          </form>

          {/* Mobile Filter Button (visible on < lg) */}
          {onOpenMobileFilter && (
            <Button
              type="button"
              variant="outline"
              onClick={onOpenMobileFilter}
              className="relative h-13 shrink-0 cursor-pointer rounded-2xl border-border/80 px-4 lg:hidden"
            >
              <FilterIcon className="text-primary" />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="default"
                  className="ml-2 h-5 min-w-5 rounded-full px-1.5 text-[11px]"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          )}
        </div>

        {/* Suggested Keywords Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground sm:text-sm">
              Gợi ý tìm kiếm:
            </span>
            {SUGGESTED_KEYWORDS.map((item) => {
              const isSelected = query.toLowerCase() === item.label.toLowerCase()
              return (
                <motion.button
                  key={item.label}
                  type="button"
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSelectKeyword(item.label)}
                  className={cn(
                    "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    isSelected
                      ? "border-primary/40 bg-primary/10 font-semibold text-primary shadow-xs"
                      : "border-border/60 bg-muted/40 text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </motion.button>
              )
            })}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <SlidersHorizontalIcon className="size-3.5" /> Tìm kiếm thông minh với bộ lọc đa tiêu
              chí
            </span>
          </div>
        </div>
      </section>
    )
  }
)
