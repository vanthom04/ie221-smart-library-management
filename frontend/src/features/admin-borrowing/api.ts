import { api } from "@/lib/axios"

import type { BorrowRecord, Reservation, ReservationStatus } from "./types"

export const getReservations = (status?: ReservationStatus) =>
  api.get<Reservation[]>("/reservations", {
    params: status ? { reservation_status: status } : undefined
  })

export const approveReservation = (id: string) =>
  api.patch<Reservation>(`/reservations/${id}/approve`)

export const rejectReservation = (id: string, reason: string) =>
  api.patch<Reservation>(`/reservations/${id}/reject`, { reason })

export const borrowFromReservation = (id: string) =>
  api.post<BorrowRecord>(`/borrow-records/from-reservation/${id}`)

export const getBorrowRecords = () => api.get<BorrowRecord[]>("/borrow-records")

export const returnBorrow = (id: string) => api.patch<BorrowRecord>(`/borrow-records/${id}/return`)
