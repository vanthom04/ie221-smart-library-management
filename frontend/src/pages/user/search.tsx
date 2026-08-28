import { useState, useCallback } from "react"
import { useNavigate } from "react-router"
import { motion, AnimatePresence, type Variants } from "motion/react"

import { useAnimatedToast } from "@/components/ui/animated-toast"
import { SearchToolbar } from "@/features/search/components/search-toolbar"
import { BookCardGrid } from "@/features/search/components/book-card-grid"
import { BookCardList } from "@/features/search/components/book-card-list"
import { useSearchFilters } from "@/features/search/hooks/use-search-filters"
import { SearchBarSection } from "@/features/search/components/search-bar-section"
import { SearchEmptyState } from "@/features/search/components/search-empty-state"
import { SearchPagination } from "@/features/search/components/search-pagination"
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
  } = useSearchFilters()

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  // Memoized handlers to prevent child re-renders
  const handleSelectBook = useCallback(
    (book: BookItem) => {
      navigate(`/books/${book.id}`)
    },
    [navigate]
  )

  const handleToggleBookmark = useCallback(
    (bookId: string) => {
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
    },
    [toggleBookmark, paginatedBooks, addToast]
  )

  const handleActionClick = useCallback(
    (book: BookItem, action: "borrow" | "reserve") => {
      if (action === "borrow") {
        addToast({
          type: "success",
          title: "Mượn sách thành công",
          message: `Yêu cầu mượn cuốn sách "${book.title}" đã được ghi nhận. Vui lòng đến quầy nhận sách.`
        })
      } else {
        addToast({
          type: "success",
          title: "Đặt trước thành công",
          message: `Bạn đã đặt trước cuốn sách "${book.title}" thành công. Thư viện sẽ gửi thông báo khi có sách.`
        })
      }
    },
    [addToast]
  )

  return (
    <motion.div
      variants={pageContainerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 pb-8"
    >
      {/* Top Search Bar & Suggestions */}
      <motion.div variants={sectionVariants}>
        <SearchBarSection
          query={state.query}
          activeFiltersCount={activeTags.length}
          onSearch={setQuery}
          onOpenMobileFilter={() => setIsMobileDrawerOpen(true)}
        />
      </motion.div>

      {/* Main 2-Column Section: Left Filter (w-72) + Right Results (flex-1) */}
      <motion.section
        variants={sectionVariants}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[288px_1fr]"
      >
        {/* Left Column: Filter Sidebar (Desktop Sticky) */}
        <aside className="hidden shrink-0 lg:sticky lg:top-4 lg:block lg:self-start">
          <SearchFilterSidebar
            state={state}
            activeTags={activeTags}
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

          {/* Results List / Grid or Empty State with Smooth GPU AnimatePresence */}
          <AnimatePresence mode="popLayout">
            {totalItems === 0 ? (
              <motion.div
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
              </motion.div>
            ) : state.viewMode === "grid" ? (
              <motion.div
                key={`grid-page-${state.page}`}
                variants={resultContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {paginatedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={bookCardVariants}
                    whileHover={{ y: -4, transition: { duration: 0.18, ease: "easeOut" } }}
                    className="h-full transform-gpu will-change-transform"
                  >
                    <BookCardGrid
                      book={book}
                      onSelectBook={handleSelectBook}
                      onToggleBookmark={handleToggleBookmark}
                      onActionClick={handleActionClick}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`list-page-${state.page}`}
                variants={resultContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col gap-4"
              >
                {paginatedBooks.map((book) => (
                  <motion.div
                    key={book.id}
                    variants={bookCardVariants}
                    whileHover={{ y: -3, transition: { duration: 0.18, ease: "easeOut" } }}
                    className="transform-gpu will-change-transform"
                  >
                    <BookCardList
                      book={book}
                      onSelectBook={handleSelectBook}
                      onToggleBookmark={handleToggleBookmark}
                      onActionClick={handleActionClick}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
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
      </motion.section>

      {/* Mobile / Tablet Filter Drawer */}
      <SearchFilterDrawer
        open={isMobileDrawerOpen}
        onOpenChange={setIsMobileDrawerOpen}
        state={state}
        activeTags={activeTags}
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
    </motion.div>
  )
}

export default SearchPage
