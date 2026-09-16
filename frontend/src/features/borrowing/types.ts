export type ReservationStatus =
  "pending" | "approved" | "rejected" | "fulfilled" | "cancelled" | "expired"

export type BorrowStatus = "borrowing" | "returned" | "overdue"

export interface ReservationItem {
  id: string
  book_id: string
  title: string
  isbn: string
  quantity: number
}

export interface Reservation {
  id: string
  user_id: string
  status: ReservationStatus
  expires_at: string | null
  reviewed_at: string | null
  reviewed_by: string | null
  rejection_reason: string | null
  fulfilled_at: string | null
  created_at: string
  items: ReservationItem[]
}

export interface BorrowItem {
  id: string
  book_id: string
  title: string
  isbn: string
  quantity: number
  returned: boolean
}

export interface BorrowRecord {
  id: string
  user_id: string
  reservation_id: string | null
  borrow_date: string
  due_date: string
  return_date: string | null
  renewal_count: number
  renewed_at: string | null
  status: BorrowStatus
  created_at: string
  items: BorrowItem[]
}
