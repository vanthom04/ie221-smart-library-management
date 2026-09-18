export type {
  BorrowItem,
  BorrowRecord,
  BorrowStatus,
  Reservation,
  ReservationItem,
  ReservationStatus
} from "@/features/borrowing/types"

export interface RejectReservationPayload {
  reason: string
}
