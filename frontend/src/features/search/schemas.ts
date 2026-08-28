import { z } from "zod"

export const searchBarSchema = z.object({
  q: z.string()
})

export type SearchBarValues = z.infer<typeof searchBarSchema>
