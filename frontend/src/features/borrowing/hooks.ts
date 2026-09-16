import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { cancelReservation, getMyBorrowRecords, getMyReservations, renewBorrowRecord } from "./api"

export const borrowingKeys = {
  reservations: ["borrowing", "reservations", "me"] as const,
  records: ["borrowing", "records", "me"] as const
}

export const useMyReservations = () =>
  useQuery({ queryKey: borrowingKeys.reservations, queryFn: getMyReservations })

export const useCancelReservation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelReservation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: borrowingKeys.reservations })
    }
  })
}

export const useMyBorrowRecords = () =>
  useQuery({ queryKey: borrowingKeys.records, queryFn: getMyBorrowRecords })

export const useRenewBorrowRecord = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: renewBorrowRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: borrowingKeys.records })
    }
  })
}
