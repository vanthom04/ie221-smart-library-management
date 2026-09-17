import type { 
  AdminQuickStat, 
  AdminPendingRequest, 
  AdminRecentBorrow ,
  BorrowSummaryStat,
  BorrowTrendPoint,
  CategoryStat
} from "./types"


export const MOCK_ADMIN_STATS: AdminQuickStat[] = [
  {
    id: "total-books",
    title: "Tổng số sách trong hệ thống",
    value: "12.450",
    unit: "cuốn",
    change: "+120 tháng này",
    icon: "books",
    tone: "blue"
  },
  {
    id: "total-users",
    title: "Tổng độc giả",
    value: "3.280",
    unit: "người dùng",
    change: "+45 thành viên mới",
    icon: "users",
    tone: "purple"
  },
  {
    id: "active-borrows",
    title: "Sách đang được mượn",
    value: 842,
    unit: "cuốn",
    change: "67.5% tổng kho",
    icon: "borrowed",
    tone: "green"
  },
  {
    id: "overdue-books",
    title: "Sách quá hạn mượn",
    value: 28,
    unit: "cuốn",
    change: "Cần xử lý ngay",
    icon: "overdue",
    tone: "red"
  }
]

export const MOCK_PENDING_REQUESTS: AdminPendingRequest[] = [
  {
    id: "REQ-01",
    userName: "Nguyễn Văn A",
    userCode: "SV202401",
    bookTitle: "Clean Code: A Handbook of Agile Software Craftsmanship",
    requestDate: "17/09/2026",
    type: "borrow",
    status: "pending"
  },
  {
    id: "REQ-02",
    userName: "Trần Thị B",
    userCode: "SV202409",
    bookTitle: "Designing Data-Intensive Applications",
    requestDate: "17/09/2026",
    type: "renew",
    status: "pending"
  },
  {
    id: "REQ-03",
    userName: "Lê Hoàng C",
    userCode: "SV202355",
    bookTitle: "System Design Interview – An Insider's Guide",
    requestDate: "16/09/2026",
    type: "return",
    status: "pending"
  }
]

export const MOCK_RECENT_BORROWS: AdminRecentBorrow[] = [
  {
    id: "BR-101",
    userName: "Phạm Minh D",
    bookTitle: "Refactoring: Improving the Design of Existing Code",
    borrowDate: "10/09/2026",
    dueDate: "24/09/2026",
    status: "borrowing"
  },
  {
    id: "BR-102",
    userName: "Đỗ Thu E",
    bookTitle: "Domain-Driven Design: Tackling Complexity in Software",
    borrowDate: "01/09/2026",
    dueDate: "15/09/2026",
    status: "overdue"
  },
  {
    id: "BR-103",
    userName: "Vũ Quốc F",
    bookTitle: "Python Crash Course, 3rd Edition",
    borrowDate: "05/09/2026",
    dueDate: "12/09/2026",
    status: "returned"
  }
]
export const MOCK_BORROW_TREND: BorrowTrendPoint[] = [
  { month: "01/2024", count: 2 },
  { month: "02/2024", count: 4 },
  { month: "03/2024", count: 6.5 },
  { month: "04/2024", count: 4.8 },
  { month: "05/2024", count: 9 },
  { month: "06/2024", count: 5.8 }
]

export const MOCK_BORROW_SUMMARY_STATS: BorrowSummaryStat[] = [
  { label: "Tổng số lượt mượn", value: "33", unit: "lượt" },
  { label: "Sách đã trả", value: "30", unit: "cuốn" },
  { label: "Tỉ lệ đúng hạn", value: "90.9%", trend: { value: "5%", direction: "up" } }
]

export const MOCK_CATEGORY_STATS: CategoryStat[] = [
  { categoryKey: "lifeSkills", label: "Kỹ năng sống", count: 12, percentage: 36 },
  { categoryKey: "economics", label: "Kinh tế - Quản trị", count: 8, percentage: 24 },
  { categoryKey: "literature", label: "Văn học", count: 6, percentage: 18 },
  { categoryKey: "science", label: "Khoa học - Công nghệ", count: 5, percentage: 15 },
  { categoryKey: "history", label: "Lịch sử - Tiểu sử", count: 2, percentage: 7 }
]