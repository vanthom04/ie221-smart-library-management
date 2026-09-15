# 🖥️ Frontend — Smart Library Management

Giao diện người dùng (Client SPA) cho hệ thống **Quản Lý Thư Viện & Mượn Trả Sách Thông Minh**, được thiết kế theo kiến trúc **Feature-driven Architecture**, tích hợp các công nghệ hiện đại nhất như **React 19**, **TypeScript**, **Vite**, **React Router v8**, **TanStack React Query v5**, **Zustand**, **Tailwind CSS v4**, và **shadcn/ui**.

---

## 🚀 Công nghệ & Thư viện sử dụng

| Phân loại                 | Công nghệ / Thư viện                                     | Phiên bản | Mục đích sử dụng                                          |
| :------------------------ | :------------------------------------------------------- | :-------: | :-------------------------------------------------------- |
| **Core Runtime**          | [React](https://react.dev/)                              |   19.x    | Thư viện xây dựng UI                                      |
|                           | [TypeScript](https://www.typescriptlang.org/)            |    6.x    | Type safety & phát triển code tin cậy                     |
|                           | [Node.js](https://nodejs.org/)                           |  >= 22.x  | Môi trường runtime yêu cầu                                |
| **Build & Compiler**      | [Vite](https://vite.dev/)                                |    8.x    | Build tool & HMR Dev Server                               |
|                           | [React Compiler](https://react.dev/learn/react-compiler) |    1.x    | Tối ưu re-render tự động (`babel-plugin-react-compiler`)  |
| **State & Data Fetching** | [Zustand](https://zustand-demo.pmnd.rs/)                 |    5.x    | Quản lý state toàn cục nhẹ & hiệu quả (Auth state)        |
|                           | [TanStack React Query](https://tanstack.com/query)       |    5.x    | Quản lý server state, caching & auto refetching           |
|                           | [Axios](https://axios-http.com/)                         |    1.x    | HTTP client với cơ chế Refresh Token Queue & Retry        |
| **Routing**               | [React Router](https://reactrouter.com/)                 |    8.x    | Client-side Data Routing, Lazy Loading & Route Middleware |
| **Form & Validation**     | [React Hook Form](https://react-hook-form.com/)          |    7.x    | Quản lý form linh hoạt & tối ưu hiệu năng                 |
|                           | [Zod](https://zod.dev/)                                  |    4.x    | Schema validation cho Form data & API responses           |
| **UI & Styling**          | [Tailwind CSS](https://tailwindcss.com/)                 |    4.x    | Utility-first CSS framework (`@tailwindcss/vite`)         |
|                           | [shadcn/ui](https://ui.shadcn.com/)                      |     —     | Bộ UI Component phong phú (Radix UI / Base UI)            |
|                           | [Lucide React](https://lucide.dev/)                      |    1.x    | Thư viện Icon                                             |
|                           | [Motion](https://motion.dev/)                            |   13.x    | Thư viện hiệu ứng animation                               |
|                           | [Recharts](https://recharts.org/)                        |    3.x    | Biểu đồ thống kê trực quan                                |
|                           | [Embla Carousel](https://www.embla-carousel.com/)        |    8.x    | Carousel hiển thị nội dung nổi bật                        |
| **Code Quality**          | [ESLint](https://eslint.org/)                            |   10.x    | Code linting                                              |
|                           | [Prettier](https://prettier.io/)                         |    3.x    | Code formatting & Tailwind CSS plugin                     |

---

## 📂 Cấu trúc thư mục dự án

Dự án áp dụng cấu trúc **Feature-driven Architecture**, phân chia mã nguồn theo từng tính năng chuyên biệt giúp dễ dàng mở rộng và bảo trì:

```text
frontend/
├── public/                  # Static assets (favicons, images, logos)
├── src/
│   ├── components/          # Components dùng chung toàn hệ thống
│   │   ├── ui/              # shadcn/ui components (59+ components)
│   │   ├── app-header.tsx   # Thanh Header điều hướng chính
│   │   ├── app-sidebar.tsx  # Thanh Sidebar điều hướng ứng dụng
│   │   ├── fallback-loader.tsx # Component loading cho Lazy Routes
│   │   └── root-error-boundary.tsx # Bắt lỗi toàn cục
│   ├── features/            # Mô-đun theo tính năng (Feature-driven)
│   │   ├── auth/            # Xác thực người dùng (Forms, Schemas, Zustand Store)
│   │   ├── home/            # Trang chủ (Hero Banner, Danh mục, Thẻ thống kê)
│   │   ├── profile/         # Hồ sơ cá nhân & Bảo mật (Tabs, Forms, Schemas)
│   │   ├── search/          # Tra cứu & Tìm kiếm sách nâng cao
│   │   │   ├── components/  # Grid/List Cards, Sticky Filter Sidebar, Drawer, Toolbar
│   │   │   ├── hooks/       # useSearchFilters hook đồng bộ URL SearchParams
│   │   │   ├── constants.ts # Hằng số màu sắc, danh mục, cấu hình
│   │   │   ├── mock-data.ts # Dữ liệu mẫu phong phú
│   │   │   ├── schemas.ts   # Zod schema cho thanh tìm kiếm
│   │   │   └── types.ts     # TypeScript interfaces & types
│   │   ├── user-dashboard/  # Bảng điều khiển bạn đọc (Recharts Charts, Gợi ý, Sách đang mượn)
│   │   └── users/           # Quản lý người dùng & API Hooks
│   ├── hooks/               # Custom React Hooks dùng chung (use-mobile.ts)
│   ├── layouts/             # App Layouts (main-layout.tsx)
│   ├── lib/                 # Utilities & Config Layer
│   │   ├── api-error.ts     # Chuẩn hóa lỗi API
│   │   ├── axios.ts         # Axios client, Interceptors & Auto Refresh Token Queue
│   │   ├── query-client.ts  # Cấu hình TanStack React Query Client
│   │   └── utils.ts         # Utility functions (cn, clsx, tailwind-merge)
│   ├── pages/               # Page Views (Lazy-loaded Routes)
│   │   ├── auth/            # Login (/login), Register (/register)
│   │   └── user/            # Giao diện người dùng
│   │       ├── home.tsx            # Trang chủ (/)
│   │       ├── search.tsx          # Tìm kiếm & Lọc sách (/search)
│   │       ├── book-detail.tsx     # Chi tiết sách (/books/:id)
│   │       ├── book-reservation.tsx# Đặt trước sách (/book-reservation)
│   │       ├── borrow-history.tsx  # Lịch sử mượn trả (/borrow-history)
│   │       ├── dashboard.tsx       # Bảng điều khiển cá nhân (/dashboard)
│   │       └── profile.tsx         # Hồ sơ & Cài đặt tài khoản (/profile)
│   ├── router/              # Router definitions & Middlewares
│   │   ├── middleware.ts    # Route Middleware (requireAuth, requireGuest, loadSession)
│   │   └── routes.tsx       # Cấu hình Data Router (React Router v8)
│   ├── globals.css          # Tailwind CSS v4 setup & custom tokens
│   └── main.tsx             # Entry point (Providers & React Router)
├── index.html               # HTML entry point template
├── vite.config.ts           # Cấu hình Vite, React Compiler & Path Alias (@)
├── tsconfig.json            # Cấu hình TypeScript gốc
├── tsconfig.app.json        # Cấu hình TypeScript cho ứng dụng
├── tsconfig.node.json       # Cấu hình TypeScript cho Node environment
├── eslint.config.js         # Cấu hình ESLint v10
├── prettier.config.js       # Cấu hình Prettier & Tailwind plugin
├── components.json          # Cấu hình shadcn/ui CLI
├── package.json             # Danh sách dependencies & scripts
└── .env.example             # Biến môi trường mẫu
```

---

## 🛠️ Hướng dẫn cài đặt & Khởi chạy

### Yêu cầu môi trường

- **Node.js** >= 22.x
- **npm** >= 10.x (hoặc `pnpm` / `yarn`)

### Các bước cài đặt

1. **Di chuyển vào thư mục frontend:**

   ```bash
   cd frontend
   ```

2. **Cài đặt các gói phụ thuộc (dependencies):**

   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường:**
   Tạo file `.env` từ file mẫu `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Cập nhật URL của Backend API trong file `.env`:

   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Khởi chạy Development Server:**

   ```bash
   npm run dev
   ```

   Ứng dụng sẽ chạy tại: **`http://localhost:5173`**

---

## 📜 Các lệnh (Scripts) có sẵn

| Lệnh Script        | Mô tả chi tiết                                                      |
| :----------------- | :------------------------------------------------------------------ |
| `npm run dev`      | Khởi chạy Vite development server hỗ trợ HMR                        |
| `npm run build`    | Kiểm tra type-checking (`tsc -b`) và biên dịch dự án cho production |
| `npm run preview`  | Khởi chạy local server để xem trước bản build production            |
| `npm run lint`     | Phân tích và kiểm tra lỗi định dạng code với ESLint                 |
| `npm run lint:fix` | Tự động sửa các lỗi ESLint có thể tự fix                            |
| `npm run format`   | Tự động format toàn bộ source code với Prettier                     |

---

## 🔑 Cấu trúc Điều hướng & Phân quyền (Routing & Middleware)

Dự án sử dụng **React Router v8 Data Router** kết hợp với **Route Middleware** và **Zustand Auth Store**:

### Middleware bảo vệ Route (`src/router/middleware.ts`)

- **`requireAuth`**: Bảo vệ các tuyến đường riêng tư. Kiểm tra phiên đăng nhập hiện tại; nếu hết hạn sẽ tự gọi refresh token. Nếu người dùng chưa đăng nhập, tự động chuyển hướng về `/login?redirect=<target_path>`.
- **`requireGuest`**: Dành cho các trang dành riêng cho khách (`/login`, `/register`). Nếu người dùng đã đăng nhập, tự động chuyển hướng về `/dashboard`.
- **`loadSession`**: Tự động tải lại phiên làm việc của người dùng khi làm mới trang.

### Danh sách Trang & Tuyến đường (Routes)

| Đường dẫn (Path)    | Loại Route | Middleware Bảo Vệ | Nội dung Trang                               |
| :------------------ | :--------: | :---------------: | :------------------------------------------- |
| `/`                 |   Public   |         —         | Trang chủ giới thiệu hệ thống thư viện       |
| `/search`           |   Public   |         —         | Trang tìm kiếm & tra cứu đầu sách nâng cao   |
| `/books/:id`        |   Public   |         —         | Trang chi tiết thông tin sách                |
| `/login`            |   Guest    |  `requireGuest`   | Trang đăng nhập hệ thống                     |
| `/register`         |   Guest    |  `requireGuest`   | Trang đăng ký tài khoản thành viên           |
| `/dashboard`        | Protected  |   `requireAuth`   | Bảng điều khiển cá nhân & thống kê mượn sách |
| `/book-reservation` | Protected  |   `requireAuth`   | Trang quản lý đặt trước sách                 |
| `/borrow-history`   | Protected  |   `requireAuth`   | Trang theo dõi lịch sử mượn / trả sách       |
| `/profile`          | Protected  |   `requireAuth`   | Trang xem và cập nhật thông tin cá nhân      |

---

## 🌟 Các tính năng nổi bật (Feature Highlights)

### 1. Tìm kiếm & Tra cứu Sách Nâng Cao (`/search`)

- **Thanh tìm kiếm linh hoạt**: Quản lý bằng `react-hook-form` + `zod`, hỗ trợ gợi ý từ khóa tìm kiếm nhanh (Trending keywords).
- **Cột bộ lọc Đa tiêu chí Sticky**: Ghim cố định khi cuộn trang (`sticky top-4 lg:self-start`), thanh cuộn nội bộ mượt mà với các tiêu chí: Tình trạng sách, Thể loại, Tác giả, Nhà xuất bản, Ngôn ngữ, Năm xuất bản.
- **Đồng bộ URL 2 chiều**: Toàn bộ từ khóa tìm kiếm, bộ lọc, chế độ xem (Grid / List), trang hiện tại được tự động đồng bộ lên URL SearchParams giúp chia sẻ liên kết dễ dàng.
- **Chuyển đổi hiển thị linh hoạt**: Hỗ trợ chuyển đổi nhanh giữa dạng Lưới (Card Grid) và Danh sách (Card List) kèm thông tin vị trí kệ sách chi tiết.
- **Tương tác nhanh**: Lưu sách vào danh sách yêu thích (Bookmark), Mượn sách / Đặt trước trực tiếp với hệ thống thông báo động `useAnimatedToast`.
- **Drawer Mobile**: Trải nghiệm lọc sách tiện lợi trên điện thoại và máy tính bảng qua Slide Drawer.

### 2. Bảng điều khiển Bạn đọc (`/dashboard`)

- **Thống kê tổng quan**: Số sách đang mượn, sách quá hạn, tiền phạt chưa thanh toán, yêu cầu đặt trước.
- **Biểu đồ trực quan (Recharts)**: Biểu đồ xu hướng mượn sách qua các tháng và biểu đồ phân bổ thể loại sách yêu thích (Donut Chart).
- **Cảnh báo hạn trả**: Thẻ danh sách tài liệu sắp đến hạn trả với màu sắc trực quan giúp tránh bị phạt quá hạn.
- **Gợi ý thông minh**: Đề xuất đầu sách phù hợp dựa trên thói quen đọc.

### 3. Hồ sơ Cá nhân & Bảo mật (`/profile`)

- Cập nhật thông tin cá nhân, ảnh đại diện, số điện thoại, đơn vị trực thuộc.
- Đổi mật khẩu tài khoản kèm kiểm tra độ mạnh mật khẩu và Zod validation.
- Thiết lập bảo mật nâng cao (Xác thực 2 bước 2FA, theo dõi phiên đăng nhập).
- Quản lý tùy chọn nhận thông báo qua Email / SMS / Thông báo trong ứng dụng.

---

## ⚡ Cơ chế HTTP Client & Auto Refresh Token Queue

HTTP Client được thiết lập tại `src/lib/axios.ts` với các đặc điểm nổi bật:

1. **Tự động gắn Access Token**: Tự động lấy `accessToken` từ `useAuthStore` để đính kèm vào header `Authorization: Bearer <token>` của mọi HTTP request.
2. **Xử lý Tự Động Xoay Vòng Token (Refresh Token Queue)**: Khi API trả về lỗi `401 Unauthorized`, Axios interceptor sẽ tạm dừng các request tiếp theo và đưa chúng vào hàng chờ (`refreshQueue`), đồng thời tự động gọi API `/auth/refresh`. Sau khi làm mới token thành công, tất cả request trong hàng chờ sẽ được tự động đính kèm token mới và gửi lại seamlessly.
3. **Chuẩn hóa lỗi `ApiError`**: Chuyển đổi mọi phản hồi lỗi HTTP thành instance `ApiError` (`src/lib/api-error.ts`) giúp việc hiển thị lỗi trên UI thống nhất và dễ dàng.

---

## 📝 Path Alias & Component Library

### Path Alias

Sử dụng kí tự `@` đại diện cho thư mục `src/`:

```typescript
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/stores/use-auth-store"
```

### Thêm Component từ shadcn/ui

Hệ thống tích hợp sẵn 59+ UI components. Để bổ sung component mới:

```bash
npx shadcn@latest add <component-name>
```

---

## ⚙️ Biến môi trường (Environment Variables)

| Biến môi trường | Mô tả                                               | Giá trị mặc định        |
| :-------------- | :-------------------------------------------------- | :---------------------- |
| `VITE_API_URL`  | Địa chỉ URL gốc của Backend API (FastAPI / Node.js) | `http://localhost:8000` |

> ⚠️ **Lưu ý:** Mọi biến môi trường sử dụng ở phía Client SPA trong Vite bắt buộc phải có prefix `VITE_`.
