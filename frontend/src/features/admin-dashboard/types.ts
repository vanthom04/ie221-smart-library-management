import type { CategoryKey } from "./constants"

// Nhóm các kiểu Union chung
export type StatIconType = "book" | "history" | "wallet" | "calendar"
export type StatTone = "blue" | "amber" | "red" | "green"
export type ActivityTypeTone = StatTone

// Nhóm Admin & Dashboard
export interface AdminQuickStat {
  id: string
  title: string
  value: string | number
  unit?: string
  change?: string
  icon: "books" | "users" | "borrowed" | "overdue" | "revenue"
  tone: "blue" | "green" | "yellow" | "red" | "purple"
}

export interface AdminPendingRequest {
  id: string
  userName: string
  bookTitle: string
  requestDate: string
  type: "borrow" | "return" | "renew"
  status: "pending" | "approved" | "rejected"
}

export interface AdminRecentBorrow {
  id: string
  userName: string
  bookTitle: string
  borrowDate: string
  dueDate: string
  status: "borrowing" | "returned" | "overdue"
}

// Nhóm Thống kê & Biểu đồ
export interface BorrowTrendPoint {
  month: string
  count: number
}

export interface BorrowSummaryStat {
  label: string
  value: string
  unit?: string
  trend?: { value: string; direction: "up" | "down" }
}

export interface CategoryStat {
  categoryKey: CategoryKey
  label: string
  count: number
  percentage: number
}

export interface BorrowOverviewData {
  stats: BorrowSummaryStat[]
  trend: BorrowTrendPoint[]
}
