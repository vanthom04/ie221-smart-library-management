import { z } from "zod"

export const changePasswordSchema = z.object({
  current_password: z.string(),
  new_password: z.string(),
  confirm_password: z.string()
})

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>
