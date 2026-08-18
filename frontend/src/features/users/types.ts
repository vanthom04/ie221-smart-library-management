export type UserRole = "user" | "admin"
export type UserStatus = "active" | "locked"

export interface User {
  id: string
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  status: UserStatus
  created_at: Date
  updated_at: Date
}
