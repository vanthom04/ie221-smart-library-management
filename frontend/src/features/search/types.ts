export type CategoryTone = "blue" | "purple" | "teal" | "indigo" | "amber" | "rose" | "emerald"

export type AvailabilityStatus = "available" | "reservable" | "ebook"

export type SortMode = "relevance" | "newest" | "most_borrowed" | "title_asc" | "year_desc"

export type ViewMode = "grid" | "list"

export interface BookCoverSpec {
  gradient: string
  textClass: string
  iconName?: string
  eyebrow?: string
  titleLines: string[]
  subtitleLines?: string[]
}

export interface ShelfLocation {
  floor: string
  shelf: string
  row: string
  callNumber: string
}

export interface BookCopy {
  barcode: string
  status: "available" | "borrowed" | "reserved" | "maintenance"
  condition: string
}

export interface BookItem {
  id: string
  title: string
  author: string
  category: string
  categoryTone: CategoryTone
  publisher: string
  publishYear: number
  isbn: string
  pages: number
  language: string
  availableCount: number
  totalCount: number
  shelfLocation: ShelfLocation
  description: string
  cover: BookCoverSpec
  copies?: BookCopy[]
  isBookmarked?: boolean
  isEbookAvailable?: boolean
  rating?: number
  borrowCount?: number
}

export interface FilterOption {
  id: string
  label: string
  count: number
}

export interface ActiveFilterTag {
  id: string
  type: "status" | "category" | "author" | "publisher" | "year" | "language"
  label: string
  value: string
}

export interface SearchFilterState {
  query: string
  statuses: AvailabilityStatus[]
  categories: string[]
  authors: string[]
  publishers: string[]
  yearRange: [number, number]
  languages: string[]
  sortBy: SortMode
  viewMode: ViewMode
  page: number
  pageSize: number
}
