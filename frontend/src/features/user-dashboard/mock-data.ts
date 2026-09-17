import type {
  ActivityItem,
  BookSuggestion,
  BorrowedBook,
  DashboardQuickStat,
  DueSoonBook
} from "./types"

export const MOCK_QUICK_STATS: DashboardQuickStat[] = [
  {
    id: "active-loans",
    title: "Sách đang mượn",
    value: 3,
    unit: "cuốn",
    icon: "book",
    tone: "blue",
    href: "/borrow-history"
  },
  {
    id: "overdue-loans",
    title: "Sách quá hạn",
    value: 1,
    unit: "cuốn",
    icon: "history",
    tone: "amber",
    href: "/borrow-history"
  },
  {
    id: "unpaid-fines",
    title: "Tiền phạt chưa trả",
    value: "25.000",
    unit: "đ",
    icon: "wallet",
    tone: "red",
    href: "/borrow-history"
  },
  {
    id: "pending-reservations",
    title: "Đặt trước đang chờ",
    value: 2,
    unit: "yêu cầu",
    icon: "calendar",
    tone: "green",
    href: "/book-reservation"
  }
]


export const MOCK_BORROWED_BOOKS: BorrowedBook[] = [
  {
    id: "dac-nhan-tam",
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    coverUrl: "https://dtv-ebook.com.vn/images/truyen-online/ebook-dac-nhan-tam-prc-pdf-epub.jpg",
    dueDate: "15/05/2024",
    daysLeft: 10
  },
  {
    id: "nha-gia-kim",
    title: "Nhà giả kim",
    author: "Paulo Coelho",
    coverUrl: "https://dtv-ebook.com.vn/images/truyen-online/ebook-dac-nhan-tam-prc-pdf-epub.jpg",
    dueDate: "24/05/2024",
    daysLeft: 19
  },
  {
    id: "sapiens",
    title: "Sapiens: Lược sử loài người",
    author: "Yuval Noah Harari",
    coverUrl: "https://dtv-ebook.com.vn/images/truyen-online/ebook-dac-nhan-tam-prc-pdf-epub.jpg",
    dueDate: "29/05/2024",
    daysLeft: 24
  }
]


export const MOCK_RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: "activity-1",
    iconTone: "green",
    description: "Bạn đã trả sách",
    bookTitle: "Nhà giả kim",
    date: "28/04/2024",
    time: "15:40"
  },
  {
    id: "activity-2",
    iconTone: "blue",
    description: "Bạn đã mượn sách",
    bookTitle: "Đắc Nhân Tâm",
    date: "01/05/2024",
    time: "10:30"
  },
  {
    id: "activity-3",
    iconTone: "blue",
    description: "Đặt trước sách",
    bookTitle: "Tư duy nhanh và chậm",
    date: "02/05/2024",
    time: "09:15"
  },
  {
    id: "activity-4",
    iconTone: "red",
    description: "Sách đã quá hạn",
    bookTitle: "Atomic Habits",
    date: "02/05/2024",
    time: "08:20"
  }
]

export const MOCK_SUGGESTED_BOOKS: BookSuggestion[] = [
  {
    id: "tu-duy-nhanh-va-cham",
    title: "Tư duy nhanh và chậm",
    author: "Daniel Kahneman",
    category: "Tâm lý học",
    coverUrl: "https://dtv-ebook.com.vn/images/truyen-online/ebook-dac-nhan-tam-prc-pdf-epub.jpg"
  },
  {
    id: "doi-thay-doi",
    title: "Đời thay đổi khi chúng ta thay đổi",
    author: "Andrew Matthews",
    category: "Kỹ năng sống",
    coverUrl: "https://dtv-ebook.com.vn/images/truyen-online/ebook-dac-nhan-tam-prc-pdf-epub.jpg"
  },
  {
    id: "nghi-giau-lam-giau",
    title: "Nghĩ giàu và làm giàu",
    author: "Napoleon Hill",
    category: "Kinh tế - Kinh doanh",
    coverUrl: "https://dtv-ebook.com.vn/images/truyen-online/ebook-dac-nhan-tam-prc-pdf-epub.jpg"
  }
]

export const MOCK_DUE_SOON_BOOKS: DueSoonBook[] = [
  {
    id: "dac-nhan-tam-due",
    title: "Đắc Nhân Tâm",
    dueDate: "15/05/2024",
    daysLeft: 10,
    coverUrl: "https://dtv-ebook.com.vn/images/truyen-online/ebook-dac-nhan-tam-prc-pdf-epub.jpg"
  },
  {
    id: "nha-gia-kim-due",
    title: "Nhà giả kim",
    dueDate: "24/05/2024",
    daysLeft: 19,
    coverUrl: "https://dtv-ebook.com.vn/images/truyen-online/ebook-dac-nhan-tam-prc-pdf-epub.jpg"
  }
]
