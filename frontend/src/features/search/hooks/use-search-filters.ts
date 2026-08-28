import { useSearchParams } from "react-router"
import { useState, useMemo, useCallback } from "react"

import { MOCK_BOOKS } from "../mock-data"
import { MIN_YEAR, MAX_YEAR } from "../constants"
import type {
  BookItem,
  AvailabilityStatus,
  SortMode,
  ViewMode,
  ActiveFilterTag,
  SearchFilterState
} from "../types"

export const useSearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

  // Parse filters from URL search params
  const query = searchParams.get("q") ?? ""
  const rawCategories = searchParams.get("categories")
  const categories = useMemo(() => (rawCategories ? rawCategories.split(",") : []), [rawCategories])

  const rawStatuses = searchParams.get("statuses")
  const statuses = useMemo(
    () => (rawStatuses ? (rawStatuses.split(",") as AvailabilityStatus[]) : []),
    [rawStatuses]
  )

  const rawAuthors = searchParams.get("authors")
  const authors = useMemo(() => (rawAuthors ? rawAuthors.split(",") : []), [rawAuthors])

  const rawPublishers = searchParams.get("publishers")
  const publishers = useMemo(() => (rawPublishers ? rawPublishers.split(",") : []), [rawPublishers])

  const rawLanguages = searchParams.get("languages")
  const languages = useMemo(() => (rawLanguages ? rawLanguages.split(",") : []), [rawLanguages])

  const yearMin = searchParams.get("yearMin") ? Number(searchParams.get("yearMin")) : MIN_YEAR
  const yearMax = searchParams.get("yearMax") ? Number(searchParams.get("yearMax")) : MAX_YEAR
  const yearRange: [number, number] = useMemo(() => [yearMin, yearMax], [yearMin, yearMax])

  const sortBy = (searchParams.get("sort") as SortMode) || "relevance"
  const viewMode = (searchParams.get("view") as ViewMode) || "grid"
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1
  const pageSize = searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 12

  // Update URL search parameters helper
  const updateParams = useCallback(
    (updater: (prev: URLSearchParams) => URLSearchParams) => {
      setSearchParams(
        (prev) => {
          const next = updater(new URLSearchParams(prev))
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  // Actions
  const setQuery = useCallback(
    (newQuery: string) => {
      updateParams((prev) => {
        if (newQuery.trim()) {
          prev.set("q", newQuery.trim())
        } else {
          prev.delete("q")
        }
        prev.set("page", "1")
        return prev
      })
    },
    [updateParams]
  )

  const toggleCategory = useCallback(
    (category: string) => {
      updateParams((prev) => {
        const curr = prev.get("categories") ? prev.get("categories")!.split(",") : []
        const exists = curr.includes(category)
        const updated = exists ? curr.filter((c) => c !== category) : [...curr, category]
        if (updated.length > 0) {
          prev.set("categories", updated.join(","))
        } else {
          prev.delete("categories")
        }
        prev.set("page", "1")
        return prev
      })
    },
    [updateParams]
  )

  const toggleStatus = useCallback(
    (status: AvailabilityStatus) => {
      updateParams((prev) => {
        const curr = prev.get("statuses") ? prev.get("statuses")!.split(",") : []
        const exists = curr.includes(status)
        const updated = exists ? curr.filter((s) => s !== status) : [...curr, status]
        if (updated.length > 0) {
          prev.set("statuses", updated.join(","))
        } else {
          prev.delete("statuses")
        }
        prev.set("page", "1")
        return prev
      })
    },
    [updateParams]
  )

  const toggleAuthor = useCallback(
    (author: string) => {
      updateParams((prev) => {
        const curr = prev.get("authors") ? prev.get("authors")!.split(",") : []
        const exists = curr.includes(author)
        const updated = exists ? curr.filter((a) => a !== author) : [...curr, author]
        if (updated.length > 0) {
          prev.set("authors", updated.join(","))
        } else {
          prev.delete("authors")
        }
        prev.set("page", "1")
        return prev
      })
    },
    [updateParams]
  )

  const togglePublisher = useCallback(
    (publisher: string) => {
      updateParams((prev) => {
        const curr = prev.get("publishers") ? prev.get("publishers")!.split(",") : []
        const exists = curr.includes(publisher)
        const updated = exists ? curr.filter((p) => p !== publisher) : [...curr, publisher]
        if (updated.length > 0) {
          prev.set("publishers", updated.join(","))
        } else {
          prev.delete("publishers")
        }
        prev.set("page", "1")
        return prev
      })
    },
    [updateParams]
  )

  const toggleLanguage = useCallback(
    (language: string) => {
      updateParams((prev) => {
        const curr = prev.get("languages") ? prev.get("languages")!.split(",") : []
        const exists = curr.includes(language)
        const updated = exists ? curr.filter((l) => l !== language) : [...curr, language]
        if (updated.length > 0) {
          prev.set("languages", updated.join(","))
        } else {
          prev.delete("languages")
        }
        prev.set("page", "1")
        return prev
      })
    },
    [updateParams]
  )

  const setYearRange = useCallback(
    (range: [number, number]) => {
      updateParams((prev) => {
        if (range[0] !== MIN_YEAR) {
          prev.set("yearMin", range[0].toString())
        } else {
          prev.delete("yearMin")
        }
        if (range[1] !== MAX_YEAR) {
          prev.set("yearMax", range[1].toString())
        } else {
          prev.delete("yearMax")
        }
        prev.set("page", "1")
        return prev
      })
    },
    [updateParams]
  )

  const setSortBy = useCallback(
    (sort: SortMode) => {
      updateParams((prev) => {
        if (sort !== "relevance") {
          prev.set("sort", sort)
        } else {
          prev.delete("sort")
        }
        return prev
      })
    },
    [updateParams]
  )

  const setViewMode = useCallback(
    (view: ViewMode) => {
      updateParams((prev) => {
        if (view !== "grid") {
          prev.set("view", view)
        } else {
          prev.delete("view")
        }
        return prev
      })
    },
    [updateParams]
  )

  const setPage = useCallback(
    (newPage: number) => {
      updateParams((prev) => {
        if (newPage > 1) {
          prev.set("page", newPage.toString())
        } else {
          prev.delete("page")
        }
        return prev
      })
    },
    [updateParams]
  )

  const setPageSize = useCallback(
    (newSize: number) => {
      updateParams((prev) => {
        if (newSize !== 12) {
          prev.set("pageSize", newSize.toString())
        } else {
          prev.delete("pageSize")
        }
        prev.set("page", "1")
        return prev
      })
    },
    [updateParams]
  )

  const resetFilters = useCallback(() => {
    updateParams((prev) => {
      const q = prev.get("q")
      const next = new URLSearchParams()
      if (q) next.set("q", q)
      return next
    })
  }, [updateParams])

  const toggleBookmark = useCallback((bookId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev)
      if (next.has(bookId)) {
        next.delete(bookId)
      } else {
        next.add(bookId)
      }
      return next
    })
  }, [])

  // Active filter tags for display and quick removal
  const activeTags = useMemo<ActiveFilterTag[]>(() => {
    const tags: ActiveFilterTag[] = []

    statuses.forEach((s) => {
      const label =
        s === "available" ? "Có sẵn" : s === "reservable" ? "Có thể đặt trước" : "E-book"
      tags.push({ id: `status-${s}`, type: "status", label, value: s })
    })

    categories.forEach((c) => {
      tags.push({ id: `cat-${c}`, type: "category", label: c, value: c })
    })

    authors.forEach((a) => {
      tags.push({ id: `author-${a}`, type: "author", label: a, value: a })
    })

    publishers.forEach((p) => {
      tags.push({ id: `pub-${p}`, type: "publisher", label: p, value: p })
    })

    languages.forEach((l) => {
      tags.push({ id: `lang-${l}`, type: "language", label: l, value: l })
    })

    if (yearMin > MIN_YEAR || yearMax < MAX_YEAR) {
      tags.push({
        id: "year-range",
        type: "year",
        label: `${yearMin} - ${yearMax}`,
        value: `${yearMin}-${yearMax}`
      })
    }

    return tags
  }, [statuses, categories, authors, publishers, languages, yearMin, yearMax])

  const removeFilterTag = useCallback(
    (tag: ActiveFilterTag) => {
      switch (tag.type) {
        case "status":
          toggleStatus(tag.value as AvailabilityStatus)
          break
        case "category":
          toggleCategory(tag.value)
          break
        case "author":
          toggleAuthor(tag.value)
          break
        case "publisher":
          togglePublisher(tag.value)
          break
        case "language":
          toggleLanguage(tag.value)
          break
        case "year":
          setYearRange([MIN_YEAR, MAX_YEAR])
          break
      }
    },
    [toggleStatus, toggleCategory, toggleAuthor, togglePublisher, toggleLanguage, setYearRange]
  )

  // Filter and sort execution
  const filteredBooks = useMemo<BookItem[]>(() => {
    return MOCK_BOOKS.filter((book) => {
      // Text search query
      if (query.trim()) {
        const q = query.toLowerCase().trim()
        const matchTitle = book.title.toLowerCase().includes(q)
        const matchAuthor = book.author.toLowerCase().includes(q)
        const matchDesc = book.description.toLowerCase().includes(q)
        const matchIsbn = book.isbn.toLowerCase().includes(q)
        const matchCategory = book.category.toLowerCase().includes(q)
        if (!matchTitle && !matchAuthor && !matchDesc && !matchIsbn && !matchCategory) {
          return false
        }
      }

      // Statuses
      if (statuses.length > 0) {
        const matchStatus = statuses.some((status) => {
          if (status === "available") return book.availableCount > 0
          if (status === "reservable") return book.availableCount === 0
          if (status === "ebook") return Boolean(book.isEbookAvailable)
          return false
        })
        if (!matchStatus) return false
      }

      // Categories
      if (categories.length > 0 && !categories.includes(book.category)) {
        return false
      }

      // Authors
      if (authors.length > 0 && !authors.includes(book.author)) {
        return false
      }

      // Publishers
      if (publishers.length > 0 && !publishers.includes(book.publisher)) {
        return false
      }

      // Languages
      if (languages.length > 0 && !languages.includes(book.language)) {
        return false
      }

      // Year range
      if (book.publishYear < yearMin || book.publishYear > yearMax) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === "newest") {
        return b.publishYear - a.publishYear
      }
      if (sortBy === "most_borrowed") {
        return (b.borrowCount || 0) - (a.borrowCount || 0)
      }
      if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title, "vi")
      }
      if (sortBy === "year_desc") {
        return b.publishYear - a.publishYear
      }
      // "relevance" (default)
      if (query.trim()) {
        const q = query.toLowerCase()
        const aTitleMatch = a.title.toLowerCase().includes(q)
        const bTitleMatch = b.title.toLowerCase().includes(q)
        if (aTitleMatch && !bTitleMatch) return -1
        if (!aTitleMatch && bTitleMatch) return 1
      }
      return (b.borrowCount || 0) - (a.borrowCount || 0)
    })
  }, [query, statuses, categories, authors, publishers, languages, yearMin, yearMax, sortBy])

  // Pagination calculation
  const totalItems = filteredBooks.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const validPage = Math.min(Math.max(1, page), totalPages)

  const paginatedBooks = useMemo(() => {
    const start = (validPage - 1) * pageSize
    return filteredBooks.slice(start, start + pageSize).map((book) => ({
      ...book,
      isBookmarked: bookmarkedIds.has(book.id)
    }))
  }, [filteredBooks, validPage, pageSize, bookmarkedIds])

  const state: SearchFilterState = {
    query,
    statuses,
    categories,
    authors,
    publishers,
    yearRange,
    languages,
    sortBy,
    viewMode,
    page: validPage,
    pageSize
  }

  return {
    state,
    totalItems,
    totalPages,
    paginatedBooks,
    activeTags,
    bookmarkedIds,
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
  }
}
