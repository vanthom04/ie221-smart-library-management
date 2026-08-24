import type { CategoryKey } from "./constants"

export interface BorrowTrendPoint {
  month: string
  count: number
}

export interface BorrowSummaryStat {
  label: string
  value: string
  unit?: string
  trend?: {
    value: string
    direction: "up" | "down"
  }
}

export interface CategoryStat {
  categoryKey: CategoryKey
  label: string
  count: number
  percentage: number
}

export type StatIconType = "book" | "history" | "wallet" | "calendar"
export type StatTone = "blue" | "amber" | "red" | "green"

export interface DashboardQuickStat {
  id: string
  title: string
  value: string | number
  unit?: string
  icon: StatIconType
  tone: StatTone
  href: string
}

export type ActivityTypeTone = "green" | "blue" | "amber" | "red"

export interface ActivityItem {
  id: string
  iconTone: ActivityTypeTone
  description: string
  bookTitle?: string
  date: string
  time: string
}

export interface BorrowedBook {
  id: string
  title: string
  author: string
  coverUrl?: string
  dueDate: string
  daysLeft: number
}

export interface BookSuggestion {
  id: string
  title: string
  author: string
  coverUrl?: string
  category?: string
}

export interface DueSoonBook {
  id: string
  title: string
  dueDate: string
  daysLeft: number
  coverUrl?: string
}
