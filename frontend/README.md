# 🖥️ Frontend — Smart Library Management

Single-page application cho hệ thống quản lý thư viện, phục vụ cả **bạn đọc** và **quản trị viên**. Frontend dùng React 19 + TypeScript, tổ chức theo feature, giao tiếp với FastAPI qua REST API và dùng access token kết hợp refresh token HttpOnly.

## Chức năng hiện có

### Bạn đọc

- Đăng ký, đăng nhập, đăng xuất và tự khôi phục phiên.
- Xem trang chủ, catalog, chi tiết sách và tra cứu theo bộ lọc.
- Tìm kiếm ngữ nghĩa bằng AI.
- Đặt trước sách, hủy yêu cầu, xem lịch sử mượn và gia hạn.
- Dashboard gồm thống kê nhanh, sách đang mượn/sắp đến hạn, hoạt động gần đây và gợi ý AI.
- Xem hồ sơ và đổi mật khẩu. Các tab cập nhật hồ sơ, thông báo và tùy chọn bảo mật khác hiện chủ yếu là giao diện; backend chưa có API lưu các thiết lập này.

### Quản trị viên

- Dashboard tổng quan, giao dịch gần đây, phân bố thể loại và xu hướng mượn.
- CRUD sách, thể loại, tác giả và nhà xuất bản.
- Duyệt/từ chối đặt trước và chuyển phiếu đã duyệt thành phiếu mượn.
- Xem danh sách mượn và xác nhận trả sách.

## Công nghệ chính

| Nhóm | Công nghệ | Vai trò |
| :--- | :--- | :--- |
| Core | React 19, TypeScript 6, Vite 8 | UI, type checking và build |
| Routing | React Router 8 | Data Router, lazy route và middleware |
| Server state | TanStack Query 5, Axios | Cache, mutation và HTTP client |
| Client state | Zustand 5 | Access token và trạng thái phiên |
| Forms | React Hook Form, Zod | Form và validation |
| UI | Tailwind CSS 4, shadcn/Base UI, Lucide | Styling và component dùng chung |
| Visualization | Recharts, Motion | Biểu đồ và animation |
| Quality | ESLint 10, Prettier 3 | Kiểm tra và định dạng mã nguồn |

Yêu cầu runtime trong `package.json`: **Node.js >= 22**.

## Kiến trúc

```text
Page / Route
    ├── feature components + hooks ── TanStack Query
    └── Zustand auth ── Axios client ── REST API /api/v1
                              └── refresh-token queue khi gặp 401
```

```text
frontend/
├── public/                  # Logo, ảnh và icon tĩnh
├── src/
│   ├── components/          # Header, sidebar, error/loading và UI primitives
│   ├── features/
│   │   ├── auth/            # Form/schema/store xác thực
│   │   ├── borrowing/       # API và hooks của bạn đọc
│   │   ├── admin-borrowing/ # Nghiệp vụ mượn trả phía admin
│   │   ├── admin-dashboard/ # Hooks, types và biểu đồ admin
│   │   ├── user-dashboard/  # Dashboard bạn đọc
│   │   ├── search/          # Catalog filter và semantic search
│   │   ├── profile/         # Hồ sơ và bảo mật
│   │   └── home/            # Thành phần trang chủ
│   ├── layouts/             # Layout khu vực người dùng
│   ├── lib/                 # Axios, query client, ApiError, utilities
│   ├── pages/               # Route components user/admin/auth
│   ├── router/              # Route và middleware phân quyền
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
└── vite.config.ts
```

## Cài đặt và chạy

Backend cần chạy tại `http://localhost:8000` và cho phép CORS từ `http://localhost:5173`.

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

PowerShell dùng `Copy-Item .env.example .env` thay cho `cp` nếu cần. Ứng dụng mặc định chạy tại `http://localhost:5173`.

## Biến môi trường

```env
VITE_API_URL="http://localhost:8000/api/v1"
```

URL phải bao gồm API prefix `/api/v1`, vì Axios gọi các path tương đối như `/auth/login`, `/books/` và `/dashboard/user/quick-stats`. Không đặt secret trong biến có prefix `VITE_` vì giá trị sẽ được đóng gói vào client.

## Scripts

| Lệnh | Mô tả |
| :--- | :--- |
| `npm run dev` | Chạy Vite dev server với HMR |
| `npm run build` | Type-check bằng `tsc -b`, rồi build production |
| `npm run preview` | Xem trước bản build production |
| `npm run lint` | Kiểm tra source bằng ESLint |
| `npm run lint:fix` | Tự sửa lỗi ESLint hỗ trợ |
| `npm run format` | Format file trong `src` bằng Prettier |

## Routing và phân quyền

| Route | Quyền | Nội dung |
| :--- | :---: | :--- |
| `/`, `/books`, `/books/:id`, `/search` | Public | Trang chủ và catalog |
| `/login`, `/register` | Guest | Xác thực |
| `/dashboard` | User | Dashboard cá nhân |
| `/book-reservation` | User | Phiếu đặt trước |
| `/borrow-history` | User | Lịch sử mượn trả và gia hạn |
| `/profile` | User | Hồ sơ và bảo mật |
| `/admin` | Admin | Quản lý thể loại (route mặc định) |
| `/admin/dashboard` | Admin | Dashboard quản trị |
| `/admin/authors`, `/admin/publishers`, `/admin/books` | Admin | Quản lý catalog |
| `/admin/reservations`, `/admin/borrows` | Admin | Quản lý đặt và mượn trả |

Middleware trong `src/router/middleware.ts`:

- `loadSession`: thử khôi phục access token từ refresh cookie khi tải ứng dụng.
- `requireGuest`: chuyển user đã đăng nhập khỏi trang login/register.
- `requireAuth`: yêu cầu phiên hợp lệ và giữ URL đích để chuyển tiếp sau đăng nhập.
- `requireAdmin`: yêu cầu đăng nhập và role `admin` cho nhánh `/admin`.

## HTTP client và dữ liệu

Axios ở `src/lib/axios.ts` bật `withCredentials` để gửi refresh cookie. Request interceptor gắn `Authorization: Bearer <access_token>`. Khi nhiều request đồng thời nhận `401`, chỉ một request refresh được gửi; các request còn lại chờ trong queue rồi retry bằng token mới. Refresh thất bại sẽ xóa phiên và đưa user về trang đăng nhập.

Response interceptor trả trực tiếp `response.data` và chuẩn hóa lỗi thành `ApiError`; các hàm API vì vậy được typed theo payload thay vì `AxiosResponse`. TanStack Query quản lý cache theo feature và invalidate dữ liệu liên quan sau các mutation.

## Tích hợp backend

| Nhóm | Endpoint tiêu biểu |
| :--- | :--- |
| Auth/profile | `/auth/*`, `/users/me` |
| Catalog | `/books/`, `/categories/`, `/authors/`, `/publishers/` |
| AI | `/ai/search`, `/ai/recommendations` |
| Bạn đọc | `/reservations/me`, `/borrow-records/me`, `/dashboard/user/*` |
| Admin | `/reservations`, `/borrow-records`, `/dashboard/admin/*` |

Catalog search hiện tải danh sách sách và metadata rồi áp dụng nhiều bộ lọc/phân trang ở client. Semantic search gọi backend riêng khi có truy vấn hợp lệ.

## Kiểm tra trước khi gửi thay đổi

```bash
npm run lint
npm run build
```

Repo chưa cấu hình test runner frontend; `npm run build` là bước xác minh chính cho type-check và bundle production.
