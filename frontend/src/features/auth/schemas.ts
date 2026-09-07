import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .email({ message: "Email không đúng định dạng" })
    .max(150, { message: "Email không được vượt quá 150 ký tự" }),
  password: z
    .string({ message: "Vui lòng nhập mật khẩu" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
    .max(128, { message: "Mật khẩu không được vượt quá 128 ký tự" })
})

export const registerSchema = z
  .object({
    full_name: z
      .string({ message: "Vui lòng nhập họ và tên" })
      .min(3, { message: "Họ và tên phải có ít nhất 3 ký tự" })
      .max(150, { message: "Họ và tên không được vượt quá 150 ký tự" }),
    email: z
      .email({ message: "Email không đúng định dạng" })
      .max(150, { message: "Email không được vượt quá 150 ký tự" }),
    password: z
      .string({ message: "Vui lòng nhập mật khẩu" })
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
      .max(128, { message: "Mật khẩu không được vượt quá 128 ký tự" }),
    confirmPassword: z
      .string({ message: "Vui lòng xác nhận mật khẩu" })
      .min(6, { message: "Mật khẩu xác nhận phải có ít nhất 6 ký tự" })
      .max(128, { message: "Mật khẩu xác nhận không được vượt quá 128 ký tự" })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"]
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
