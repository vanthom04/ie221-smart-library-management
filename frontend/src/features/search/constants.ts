import type { CategoryTone, FilterOption, SortMode } from "./types"

export const CATEGORY_TONE_STYLES: Record<
  CategoryTone,
  { badge: string; border: string; accent: string }
> = {
  blue: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    border: "border-blue-200",
    accent: "text-blue-600"
  },
  purple: {
    badge: "bg-purple-50 text-purple-700 border-purple-200",
    border: "border-purple-200",
    accent: "text-purple-600"
  },
  teal: {
    badge: "bg-teal-50 text-teal-700 border-teal-200",
    border: "border-teal-200",
    accent: "text-teal-600"
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
    border: "border-indigo-200",
    accent: "text-indigo-600"
  },
  amber: {
    badge: "bg-amber-50 text-amber-800 border-amber-200",
    border: "border-amber-200",
    accent: "text-amber-600"
  },
  rose: {
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    border: "border-rose-200",
    accent: "text-rose-600"
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    border: "border-emerald-200",
    accent: "text-emerald-600"
  }
}

export const SUGGESTED_KEYWORDS = [
  { label: "quản trị thời gian" },
  { label: "kỹ năng học tập" },
  { label: "phát triển bản thân" },
  { label: "tâm lý học" },
  { label: "lập trình web" },
  { label: "trí tuệ nhân tạo" }
]

export const STATUS_OPTIONS: { id: "available" | "reservable" | "ebook"; label: string }[] = [
  { id: "available", label: "Có sẵn để mượn" },
  { id: "reservable", label: "Có thể đặt trước (Hết sẵn có)" },
  { id: "ebook", label: "Bản điện tử (E-book)" }
]

export const CATEGORY_FILTERS: FilterOption[] = [
  { id: "Kỹ năng sống", label: "Kỹ năng sống", count: 42 },
  { id: "Quản trị – Kinh doanh", label: "Quản trị – Kinh doanh", count: 28 },
  { id: "Tâm lý học", label: "Tâm lý học", count: 18 },
  { id: "Công nghệ thông tin", label: "Công nghệ thông tin", count: 24 },
  { id: "Giáo dục & Đào tạo", label: "Giáo dục & Đào tạo", count: 15 },
  { id: "Khoa học tự nhiên", label: "Khoa học tự nhiên", count: 12 },
  { id: "Văn học – Tiểu thuyết", label: "Văn học – Tiểu thuyết", count: 30 }
]

export const AUTHOR_FILTERS: FilterOption[] = [
  { id: "Brian Tracy", label: "Brian Tracy", count: 8 },
  { id: "James Clear", label: "James Clear", count: 6 },
  { id: "Cal Newport", label: "Cal Newport", count: 5 },
  { id: "Stephen R. Covey", label: "Stephen R. Covey", count: 4 },
  { id: "Nguyễn Hiến Lê", label: "Nguyễn Hiến Lê", count: 7 },
  { id: "Dale Carnegie", label: "Dale Carnegie", count: 5 },
  { id: "David Allen", label: "David Allen", count: 3 },
  { id: "Napoleon Hill", label: "Napoleon Hill", count: 4 }
]

export const PUBLISHER_FILTERS: FilterOption[] = [
  { id: "NXB Trẻ", label: "NXB Trẻ", count: 20 },
  { id: "NXB Kim Đồng", label: "NXB Kim Đồng", count: 16 },
  { id: "NXB Thế Giới", label: "NXB Thế Giới", count: 14 },
  { id: "NXB Lao Động", label: "NXB Lao Động", count: 10 },
  { id: "NXB Giáo Dục", label: "NXB Giáo Dục", count: 8 },
  { id: "NXB Tổng Hợp TP.HCM", label: "NXB Tổng Hợp TP.HCM", count: 12 }
]

export const LANGUAGE_OPTIONS: FilterOption[] = [
  { id: "Tiếng Việt", label: "Tiếng Việt", count: 110 },
  { id: "Tiếng Anh", label: "Tiếng Anh", count: 35 }
]

export const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "relevance", label: "Phù hợp nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "most_borrowed", label: "Mượn nhiều nhất" },
  { value: "title_asc", label: "Tên sách A → Z" },
  { value: "year_desc", label: "Năm XB giảm dần" }
]

export const MIN_YEAR = 2000
export const MAX_YEAR = 2026
