import { twMerge } from "tailwind-merge"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

/**
 * Định dạng số điện thoại giúp hiển thị đẹp và dễ đọc hơn.
 * @param phone Chuỗi số điện thoại đầu vào (ví dụ: "0912345678" hoặc "+84912345678")
 * @returns Chuỗi số điện thoại đã định dạng (ví dụ: "0912 345 678" hoặc "+84 912 345 678")
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.trim().replace(/(?!^\+)\D/g, "")
  if (!cleaned) return ""

  // SĐT bắt đầu bằng dấu +
  if (cleaned.startsWith("+")) {
    const match = cleaned.match(/^(\+\d{2})(\d{3})(\d{3})(\d{3,4})$/)
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`
    }
  }

  // Số điện thoại di động ở Việt Nam
  const matchMobile = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/)
  if (matchMobile) {
    return `${matchMobile[1]} ${matchMobile[2]} ${matchMobile[3]}`
  }

  // Trưởng hợp khác
  return cleaned
}
