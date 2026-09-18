import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  approveReservation,
  borrowFromReservation,
  getBorrowRecords,
  getReservations,
  rejectReservation,
  returnBorrow
} from "./api"
import type { ReservationStatus } from "./types"

export const adminBorrowingKeys = {
  reservations: ["admin", "reservations"] as const,
  reservationList: (status?: ReservationStatus) =>
    [...adminBorrowingKeys.reservations, { status }] as const,
  borrowRecords: ["admin", "borrow-records"] as const
}

export const useAdminReservations = (status?: ReservationStatus) =>
  useQuery({
    queryKey: adminBorrowingKeys.reservationList(status),
    queryFn: () => getReservations(status)
  })

export const useApproveReservation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: approveReservation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminBorrowingKeys.reservations })
    }
  })
}

export const useRejectReservation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => rejectReservation(id, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminBorrowingKeys.reservations })
    }
  })
}

export const useBorrowFromReservation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: borrowFromReservation,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminBorrowingKeys.reservations }),
        queryClient.invalidateQueries({ queryKey: adminBorrowingKeys.borrowRecords })
      ])
    }
  })
}

export const useAdminBorrowRecords = () =>
  useQuery({
    queryKey: adminBorrowingKeys.borrowRecords,
    queryFn: getBorrowRecords
  })

export const useReturnBorrow = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: returnBorrow,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminBorrowingKeys.borrowRecords })
    }
  })
}
