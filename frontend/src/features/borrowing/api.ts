import { api } from "@/lib/axios"

import type { BorrowRecord, CreateReservationPayload, Reservation } from "./types"

export const getMyReservations = () => api.get<Reservation[]>("/reservations/me")

export const cancelReservation = (reservationId: string) =>
  api.delete<Reservation>(`/reservations/${reservationId}`)

export const getMyBorrowRecords = () => api.get<BorrowRecord[]>("/borrow-records/me")

export const createReservation = (payload: CreateReservationPayload) =>
  api.post<Reservation>("/reservations", payload)
