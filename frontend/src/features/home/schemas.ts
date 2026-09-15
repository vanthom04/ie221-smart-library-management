import { z } from "zod"

export const quickSearchSchema = z.object({
  searchValue: z.string().min(2).max(255).trim()
})

export type QuickSearchValues = z.infer<typeof quickSearchSchema>
