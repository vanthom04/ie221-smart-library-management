import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/axios"

export interface SemanticSearchResult {
  book_id: string
  title: string
  isbn: string | null
  author: string | null
  category: string | null
  publisher: string | null
  score: number
}

interface SemanticSearchResponse {
  query: string
  results: SemanticSearchResult[]
  total: number
}

export function useSemanticSearch(query: string) {
  const searchQuery = query.trim()

  return useQuery({
    queryKey: ["semantic-search", searchQuery],
    queryFn: () => api.post<SemanticSearchResponse>("/ai/search", { query: searchQuery, limit: 5 }),
    enabled: searchQuery.length > 0
  })
}
