import type { BookItem } from "./types"

export const MOCK_BOOKS: BookItem[] = [
  {
    id: "quan-tri-thoi-gian-brian-tracy",
    title: "Quản Trị Thời Gian Hiệu Quả",
    author: "Brian Tracy",
    category: "Kỹ năng sống",
    categoryTone: "blue",
    publisher: "NXB Trẻ",
    publishYear: 2021,
    isbn: "978-604-1-18234-5",
    pages: 268,
    language: "Tiếng Việt",
    availableCount: 5,
    totalCount: 12,
    rating: 4.8,
    borrowCount: 342,
    isEbookAvailable: true,
    shelfLocation: {
      floor: "Tầng 2",
      shelf: "Kệ A2",
      row: "Hàng 3",
      callNumber: "650.11 TRA 2021"
    },
    description:
      "Cuốn sách hướng dẫn các phương pháp quản lý thời gian thực tiễn của Brian Tracy, giúp bạn loại bỏ sự trì hoãn, thiết lập mục tiêu rõ ràng và tăng gấp đôi năng suất làm việc mỗi ngày.",
    cover: {
      gradient: "from-teal-500 to-cyan-700",
      textClass: "text-white",
      iconName: "Clock",
      titleLines: ["Quản Trị", "THỜI GIAN", "hiệu quả"],
      subtitleLines: ["Dành cho người trẻ,", "năng động & bận rộn"]
    },
    copies: [
      { barcode: "LIB-QTTG-01", status: "available", condition: "Mới 98%" },
      { barcode: "LIB-QTTG-02", status: "available", condition: "Tốt" },
      { barcode: "LIB-QTTG-03", status: "available", condition: "Tốt" },
      { barcode: "LIB-QTTG-04", status: "borrowed", condition: "Tốt" },
      { barcode: "LIB-QTTG-05", status: "borrowed", condition: "Tốt" }
    ]
  },
  {
    id: "bay-thoi-quen-hieu-qua",
    title: "7 Thói Quen Của Bạn Trẻ Hiệu Quả",
    author: "Sean Covey",
    category: "Phát triển bản thân",
    categoryTone: "purple",
    publisher: "NXB Tổng Hợp TP.HCM",
    publishYear: 2022,
    isbn: "978-604-58-9412-1",
    pages: 340,
    language: "Tiếng Việt",
    availableCount: 3,
    totalCount: 10,
    rating: 4.9,
    borrowCount: 420,
    isEbookAvailable: true,
    shelfLocation: {
      floor: "Tầng 2",
      shelf: "Kệ B1",
      row: "Hàng 2",
      callNumber: "158.1 COV 2022"
    },
    description:
      "Cẩm nang kinh điển về xây dựng thói quen chủ động, xác định mục tiêu cuộc đời, quản lý việc ưu tiên và phát triển sự tự tin dành cho học sinh, sinh viên và người trẻ.",
    cover: {
      gradient: "from-lime-600 to-emerald-800",
      textClass: "text-white",
      iconName: "Footprints",
      titleLines: ["7 THÓI QUEN", "của bạn trẻ", "HIỆU QUẢ"]
    }
  },
  {
    id: "deep-work-cal-newport",
    title: "Deep Work – Làm Ra Làm Chơi Ra Chơi",
    author: "Cal Newport",
    category: "Kỹ năng sống",
    categoryTone: "teal",
    publisher: "NXB Thế Giới",
    publishYear: 2020,
    isbn: "978-604-77-6543-2",
    pages: 320,
    language: "Tiếng Việt",
    availableCount: 2,
    totalCount: 8,
    rating: 4.7,
    borrowCount: 280,
    shelfLocation: {
      floor: "Tầng 3",
      shelf: "Kệ C1",
      row: "Hàng 4",
      callNumber: "650.1 NEW 2020"
    },
    description:
      "Deep Work khám phá sức mạnh của sự tập trung sâu sắc không bị phân tâm trong kỷ nguyên công nghệ số, trang bị phương pháp rèn luyện trí óc làm chủ các kỹ năng phức tạp.",
    cover: {
      gradient: "from-sky-500 to-indigo-700",
      textClass: "text-white",
      iconName: "Hourglass",
      titleLines: ["DEEP WORK", "Tập trung", "SÂU SẮC"],
      subtitleLines: ["Trong thế giới", "nhiều xao nhãng"]
    }
  },
  {
    id: "atomic-habits-james-clear",
    title: "Atomic Habits – Thói Quen Nguyên Tử",
    author: "James Clear",
    category: "Tâm lý học",
    categoryTone: "rose",
    publisher: "NXB Thế Giới",
    publishYear: 2021,
    isbn: "978-604-77-8910-4",
    pages: 384,
    language: "Tiếng Việt",
    availableCount: 0,
    totalCount: 15,
    rating: 5.0,
    borrowCount: 560,
    isEbookAvailable: true,
    shelfLocation: {
      floor: "Tầng 2",
      shelf: "Kệ A1",
      row: "Hàng 1",
      callNumber: "158.1 CLE 2021"
    },
    description:
      "Cuốn sách bán chạy toàn cầu chỉ ra cách những thay đổi nhỏ 1% mỗi ngày tích lũy thành những bước nhảy vọt phi thường, loại bỏ thói quen xấu và hình thành thói quen tốt bền vững.",
    cover: {
      gradient: "from-rose-500 to-amber-600",
      textClass: "text-white",
      iconName: "Sparkles",
      titleLines: ["ATOMIC", "HABITS", "Thói quen nhỏ"],
      subtitleLines: ["Thay đổi tí hon", "Hiệu quả bất ngờ"]
    }
  },
  {
    id: "dac-nhan-tam-dale-carnegie",
    title: "Đắc Nhân Tâm (Bản dịch Nguyễn Hiến Lê)",
    author: "Dale Carnegie",
    category: "Kỹ năng sống",
    categoryTone: "indigo",
    publisher: "NXB Tổng Hợp TP.HCM",
    publishYear: 2019,
    isbn: "978-604-58-1234-8",
    pages: 320,
    language: "Tiếng Việt",
    availableCount: 6,
    totalCount: 14,
    rating: 4.9,
    borrowCount: 650,
    shelfLocation: {
      floor: "Tầng 2",
      shelf: "Kệ A3",
      row: "Hàng 1",
      callNumber: "158.2 CAR 2019"
    },
    description:
      "Nghệ thuật thu phục lòng người, tạo dựng thiện cảm và ứng xử khéo léo trong các mối quan hệ xã hội. Bản dịch kinh điển của học giả Nguyễn Hiến Lê.",
    cover: {
      gradient: "from-indigo-600 to-blue-900",
      textClass: "text-white",
      iconName: "BookOpen",
      titleLines: ["ĐẮC", "NHÂN TÂM"],
      subtitleLines: ["Nghệ thuật đối nhân", "xử thế kinh điển"]
    }
  },
  {
    id: "gtd-david-allen",
    title: "Sắp Xếp Công Việc Khoa Học (Getting Things Done)",
    author: "David Allen",
    category: "Quản trị – Kinh doanh",
    categoryTone: "amber",
    publisher: "NXB Trẻ",
    publishYear: 2020,
    isbn: "978-604-1-14902-1",
    pages: 376,
    language: "Tiếng Việt",
    availableCount: 3,
    totalCount: 6,
    rating: 4.6,
    borrowCount: 195,
    shelfLocation: {
      floor: "Tầng 3",
      shelf: "Kệ B2",
      row: "Hàng 2",
      callNumber: "650.1 ALL 2020"
    },
    description:
      "Phương pháp GTD giúp giải phóng bộ não khỏi những áp lực ghi nhớ, tổ chức danh sách công việc theo luồng xử lý 5 bước mạch lạc và tập trung cao độ vào hành động.",
    cover: {
      gradient: "from-amber-500 to-orange-700",
      textClass: "text-white",
      iconName: "StickyNote",
      titleLines: ["GETTING", "THINGS DONE", "Sắp xếp việc"]
    }
  },
  {
    id: "clean-code-robert-martin",
    title: "Clean Code – Mã Sạch Trong Lập Trình",
    author: "Robert C. Martin",
    category: "Công nghệ thông tin",
    categoryTone: "blue",
    publisher: "NXB Thế Giới",
    publishYear: 2022,
    isbn: "978-604-77-4321-9",
    pages: 464,
    language: "Tiếng Việt",
    availableCount: 4,
    totalCount: 9,
    rating: 4.9,
    borrowCount: 310,
    shelfLocation: {
      floor: "Tầng 4",
      shelf: "Kệ IT-1",
      row: "Hàng 2",
      callNumber: "005.1 MAR 2022"
    },
    description:
      "Tập hợp các nguyên tắc, chuẩn mực và kinh nghiệm quý báu giúp lập trình viên viết mã nguồn trong sáng, dễ đọc, dễ kiểm thử và bảo trì lâu dài.",
    cover: {
      gradient: "from-blue-600 to-slate-900",
      textClass: "text-white",
      iconName: "Monitor",
      titleLines: ["CLEAN CODE", "Nghệ Thuật", "Viết Mã Sạch"]
    }
  },
  {
    id: "ky-nang-hoc-tap-sinh-vien",
    title: "Kỹ Năng Học Tập Hiệu Quả Cho Sinh Viên Đại Học",
    author: "Nguyễn Hiến Lê",
    category: "Giáo dục & Đào tạo",
    categoryTone: "indigo",
    publisher: "NXB Giáo Dục",
    publishYear: 2021,
    isbn: "978-604-0-19283-4",
    pages: 240,
    language: "Tiếng Việt",
    availableCount: 7,
    totalCount: 12,
    rating: 4.7,
    borrowCount: 230,
    isEbookAvailable: true,
    shelfLocation: {
      floor: "Tầng 2",
      shelf: "Kệ G1",
      row: "Hàng 3",
      callNumber: "378.17 NGU 2021"
    },
    description:
      "Phương pháp ghi chép thông minh Cornell, sơ đồ tư duy, kỹ thuật đọc nhanh và chuẩn bị ôn thi khoa học giúp sinh viên đạt kết quả cao với thời gian tối ưu.",
    cover: {
      gradient: "from-sky-600 to-cyan-800",
      textClass: "text-white",
      iconName: "BookOpen",
      titleLines: ["KỸ NĂNG", "HỌC TẬP", "ĐẠI HỌC"]
    }
  },
  {
    id: "nghi-giau-lam-giau-napoleon-hill",
    title: "Nghĩ Giàu & Làm Giàu (Think and Grow Rich)",
    author: "Napoleon Hill",
    category: "Quản trị – Kinh doanh",
    categoryTone: "amber",
    publisher: "NXB Lao Động",
    publishYear: 2020,
    isbn: "978-604-59-8876-2",
    pages: 396,
    language: "Tiếng Việt",
    availableCount: 4,
    totalCount: 15,
    rating: 4.8,
    borrowCount: 510,
    shelfLocation: {
      floor: "Tầng 3",
      shelf: "Kệ B3",
      row: "Hàng 1",
      callNumber: "650.1 HIL 2020"
    },
    description:
      "13 nguyên tắc vàng dẫn đến thành công tài chính và sự nghiệp được đúc kết từ cuộc phỏng vấn hơn 500 nhân vật kiệt xuất thế giới của Napoleon Hill.",
    cover: {
      gradient: "from-yellow-500 to-amber-700",
      textClass: "text-slate-900",
      iconName: "Coins",
      titleLines: ["NGHĨ GIÀU", "& LÀM GIÀU"]
    }
  },
  {
    id: "tam-ly-hoc-ve-tien-morgan-housel",
    title: "Tâm Lý Học Về Tiền (The Psychology of Money)",
    author: "Morgan Housel",
    category: "Tâm lý học",
    categoryTone: "purple",
    publisher: "NXB Trẻ",
    publishYear: 2022,
    isbn: "978-604-1-20981-1",
    pages: 312,
    language: "Tiếng Việt",
    availableCount: 0,
    totalCount: 10,
    rating: 4.9,
    borrowCount: 390,
    shelfLocation: {
      floor: "Tầng 2",
      shelf: "Kệ T2",
      row: "Hàng 2",
      callNumber: "332.024 HOU 2022"
    },
    description:
      "19 mẩu chuyện ngắn tiết lộ những góc nhìn độc đáo về cách con người suy nghĩ, cảm nhận và đưa ra quyết định liên quan đến tiền bạc, lòng tham và hạnh phúc.",
    cover: {
      gradient: "from-violet-600 to-purple-900",
      textClass: "text-white",
      iconName: "Coins",
      titleLines: ["TÂM LÝ HỌC", "VỀ TIỀN"]
    }
  },
  {
    id: "thuat-quan-tri-peter-drucker",
    title: "Nhà Quản Trị Tận Tụy (The Effective Executive)",
    author: "Peter F. Drucker",
    category: "Quản trị – Kinh doanh",
    categoryTone: "teal",
    publisher: "NXB Trẻ",
    publishYear: 2018,
    isbn: "978-604-1-09821-6",
    pages: 280,
    language: "Tiếng Việt",
    availableCount: 2,
    totalCount: 6,
    rating: 4.7,
    borrowCount: 175,
    shelfLocation: {
      floor: "Tầng 3",
      shelf: "Kệ Q1",
      row: "Hàng 1",
      callNumber: "658.4 DRU 2018"
    },
    description:
      "Kinh thánh quản trị của cha đẻ ngành quản trị hiện đại Peter Drucker về cách làm việc hiệu quả, ra quyết định chính xác và phát huy điểm mạnh của nhân viên.",
    cover: {
      gradient: "from-teal-600 to-emerald-900",
      textClass: "text-white",
      iconName: "PieChart",
      titleLines: ["NHÀ QUẢN TRỊ", "TẬN TỤY"]
    }
  },
  {
    id: "dam-bi-ghet-kishimi-ichiro",
    title: "Dám Bị Ghét – Dũng Cảm Để Hạnh Phúc",
    author: "Kishimi Ichiro & Koga Fumitake",
    category: "Tâm lý học",
    categoryTone: "rose",
    publisher: "NXB Lao Động",
    publishYear: 2021,
    isbn: "978-604-59-9981-0",
    pages: 336,
    language: "Tiếng Việt",
    availableCount: 5,
    totalCount: 11,
    rating: 4.8,
    borrowCount: 460,
    shelfLocation: {
      floor: "Tầng 2",
      shelf: "Kệ T1",
      row: "Hàng 4",
      callNumber: "158.1 KIS 2021"
    },
    description:
      "Đối thoại triết học Adler giữa chàng thanh niên và nhà triết gia về tự do cá nhân, phân tách nhiệm vụ và lòng dũng cảm sống là chính mình mà không sợ người khác phán xét.",
    cover: {
      gradient: "from-rose-600 to-pink-800",
      textClass: "text-white",
      iconName: "Sparkles",
      titleLines: ["DÁM BỊ GHÉT", "Dũng cảm để", "HẠNH PHÚC"]
    }
  }
]
