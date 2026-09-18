import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/axios"

interface RecommendationItem {
  book_id: string
  title: string
  author: string | null
  category: string | null
}

interface RecommendationResponse {
  based_on_books: number
  recommendations: RecommendationItem[]
}

export function useRecommendations(userId?: string) {
  return useQuery({
    queryKey: ["user-recommendations", userId],
    queryFn: () => api.get<RecommendationResponse>("/ai/recommendations?limit=3"),
    enabled: !!userId
  })
}
