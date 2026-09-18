import { useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { m, AnimatePresence, type Variants } from "motion/react"

import { isApiError } from "@/lib/api-error"
import { useCreateReservation } from "@/features/borrowing/hooks"
import { useAnimatedToast } from "@/components/ui/animated-toast"
import { SearchToolbar } from "@/features/search/components/search-toolbar"
import { BookCardGrid } from "@/features/search/components/book-card-grid"
import { BookCardList } from "@/features/search/components/book-card-list"
import { useSearchFilters } from "@/features/search/hooks/use-search-filters"
import { useSearchBooks } from "@/features/search/hooks/use-search-books"
import { SearchPagination } from "@/features/search/components/search-pagination"
import { SearchBarSection } from "@/features/search/components/search-bar-section"
import { SearchEmptyState } from "@/features/search/components/search-empty-state"
import { SearchFilterDrawer } from "@/features/search/components/search-filter-drawer"
import { SearchFilterSidebar } from "@/features/search/components/search-filter-sidebar"
import type { BookItem } from "@/features/search/types"

const pageContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02
    }
  }
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

const resultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.02
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12 }
  }
}

const bookCardVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1]
    }
  }
}

export const SearchPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const { books, categoryOptions, authorOptions, publisherOptions, isPending, isError } =
    useSearchBooks(query)
  const { addToast } = useAnimatedToast()
  const {
    state,
    totalItems,
    totalPages,
    paginatedBooks,
    activeTags,
    setQuery,
    toggleCategory,
    toggleStatus,
    toggleAuthor,
    togglePublisher,
    toggleLanguage,
    setYearRange,
    setSortBy,
    setViewMode,
    setPage,
    setPageSize,
    resetFilters,
    removeFilterTag,
    toggleBookmark
  } = useSearchFilters(books)
  const createReservationMutation = useCreateReservation()
  const reservationInFlight = useRef(false)

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const handleSelectBook = (book: BookItem) => {
    navigate(`/books/${book.id}`)
  }

  const handleToggleBookmark = (bookId: string) => {
    toggleBookmark(bookId)
    const target = paginatedBooks.find((b) => b.id === bookId)
    if (target) {
      const isNowBookmarked = !target.isBookmarked
      addToast({
        type: "info",
        message: isNowBookmarked
          ? `Đã thêm "${target.title}" vào danh sách đã lưu.`
          : `Đã bỏ lưu cuốn "${target.title}".`
      })
    }
  }

  const handleActionClick = async (book: BookItem, action: "borrow" | "reserve") => {
    if (action !== "reserve") {
      navigate(`/books/${book.id}`)
      return
    }

    if (reservationInFlight.current) return
    reservationInFlight.current = true

    try {
      await createReservationMutation.mutateAsync({
        items: [
          {
            book_id: book.id,
            quantity: 1
          }
        ]
      })

      addToast({
        type: "success",
        title: "Đặt trước thành công",
        message: `Đã tạo phiếu đặt trước "${book.title}".`
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Không thể đặt trước",
        message: isApiError(error) ? error.message : "Vui lòng thử lại sau."
      })
    } finally {
      reservationInFlight.current = false
    }
  }

  return (
    <m.div
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 pb-8"
    >
      {/* Top Search Bar & Suggestions */}
      <m.div variants={sectionVariants}>
        <SearchBarSection
          query={state.query}
          activeFiltersCount={activeTags.length}
          onSearch={setQuery}
          onOpenMobileFilter={() => setIsMobileDrawerOpen(true)}
        />
      </m.div>

      {/* Main 2-Column Section: Left Filter (w-72) + Right Results (flex-1) */}
      <m.section
        variants={sectionVariants}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[288px_1fr]"
      >
        {/* Left Column: Filter Sidebar (Desktop Sticky) */}
        <aside className="hidden shrink-0 lg:sticky lg:top-4 lg:block lg:self-start">
          <SearchFilterSidebar
            state={state}
            activeTags={activeTags}
            categoryOptions={categoryOptions}
            authorOptions={authorOptions}
            publisherOptions={publisherOptions}
            languageOptions={[]}
            hasPublicationYears={false}
            onToggleStatus={toggleStatus}
            onToggleCategory={toggleCategory}
            onToggleAuthor={toggleAuthor}
            onTogglePublisher={togglePublisher}
            onToggleLanguage={toggleLanguage}
            onSetYearRange={setYearRange}
            onResetFilters={resetFilters}
            onRemoveTag={removeFilterTag}
          />
        </aside>

        {/* Right Column: Search Results Area */}
        <div className="min-w-0 flex-1 space-y-5">
          {/* Results Toolbar */}
          <SearchToolbar
            query={state.query}
            totalItems={totalItems}
            sortBy={state.sortBy}
            viewMode={state.viewMode}
            activeTags={activeTags}
            onSortChange={setSortBy}
            onViewModeChange={setViewMode}
            onRemoveTag={removeFilterTag}
            onResetFilters={resetFilters}
          />

          {isPending && <p className="text-sm text-muted-foreground">Đang tải sách...</p>}
          {isError && (
            <p className="text-sm text-destructive">Không thể tải sách. Vui lòng thử lại.</p>
          )}

          {/* Results List / Grid or Empty State with Smooth GPU AnimatePresence */}
          <AnimatePresence mode="popLayout">
            {!isPending && !isError && totalItems === 0 ? (
              <m.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <SearchEmptyState
                  query={state.query}
                  hasFilters={activeTags.length > 0}
                  onResetFilters={resetFilters}
                  onSelectKeyword={setQuery}
                />
              </m.div>
            ) : !isPending && !isError && state.viewMode === "grid" ? (
              <m.div
                key={`grid-page-${state.page}`}
                variants={resultContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {paginatedBooks.map((book) => (
                  <m.div
                    key={book.id}
                    variants={bookCardVariants}
                    whileHover={{ y: -4, transition: { duration: 0.18, ease: "easeOut" } }}
                    className="h-full transform-gpu"
                  >
                    <BookCardGrid
                      book={book}
                      onSelectBook={handleSelectBook}
                      onToggleBookmark={handleToggleBookmark}
                      onActionClick={handleActionClick}
                    />
                  </m.div>
                ))}
              </m.div>
            ) : !isPending && !isError ? (
              <m.div
                key={`list-page-${state.page}`}
                variants={resultContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-4"
              >
                {paginatedBooks.map((book) => (
                  <m.div
                    key={book.id}
                    variants={bookCardVariants}
                    whileHover={{ y: -3, transition: { duration: 0.18, ease: "easeOut" } }}
                    className="transform-gpu"
                  >
                    <BookCardList
                      book={book}
                      onSelectBook={handleSelectBook}
                      onToggleBookmark={handleToggleBookmark}
                      onActionClick={handleActionClick}
                    />
                  </m.div>
                ))}
              </m.div>
            ) : null}
          </AnimatePresence>

          {/* Pagination */}
          <SearchPagination
            currentPage={state.page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={state.pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </m.section>

      {/* Mobile / Tablet Filter Drawer */}
      <SearchFilterDrawer
        open={isMobileDrawerOpen}
        onOpenChange={setIsMobileDrawerOpen}
        state={state}
        activeTags={activeTags}
        categoryOptions={categoryOptions}
        authorOptions={authorOptions}
        publisherOptions={publisherOptions}
        totalItems={totalItems}
        onToggleStatus={toggleStatus}
        onToggleCategory={toggleCategory}
        onToggleAuthor={toggleAuthor}
        onTogglePublisher={togglePublisher}
        onToggleLanguage={toggleLanguage}
        onSetYearRange={setYearRange}
        onResetFilters={resetFilters}
        onRemoveTag={removeFilterTag}
      />
    </m.div>
  )
}

export default SearchPage
