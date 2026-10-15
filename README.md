# 📚 Hệ Thống Quản Lý Thư Viện & Mượn Trả Sách Thông Minh

Repository đồ án kết thúc môn **Kỹ thuật lập trình Python (IE221)**. Dự án được phát triển theo mô hình client-server, hỗ trợ nghiệp vụ dành cho bạn đọc và quản trị viên, đồng thời tích hợp tìm kiếm ngữ nghĩa và gợi ý sách cá nhân hóa.

## ✨ Chức năng chính

### Bạn đọc

- Đăng ký, đăng nhập, refresh token và đổi mật khẩu.
- Tra cứu catalog, lọc sách và tìm kiếm ngữ nghĩa bằng AI.
- Đặt trước, hủy đặt trước, xem lịch sử mượn và gia hạn sách.
- Theo dõi dashboard cá nhân: sách đang mượn, sắp đến hạn, hoạt động gần đây và gợi ý sách.

### Quản trị viên

- Quản lý sách, thể loại, tác giả và nhà xuất bản.
- Duyệt/từ chối phiếu đặt, lập phiếu mượn và xác nhận trả sách.
- Theo dõi dashboard thống kê, xu hướng mượn và phân bố thể loại.
- Khóa/mở khóa tài khoản và lập chỉ mục AI cho catalog.

## 👥 Danh sách thành viên (Nhóm 11)

| STT | Tên thành viên | MSSV | Phân công |
| :-: | :--- | :---: | :--- |
| 1 | Trần Ngọc Tâm | 25410300 | Book Catalog |
| 2 | Hồ Thiên Phúc | 25410284 | Dashboard & QA |
| 3 | Chu Văn Thơm | 25410314 | IAM & Infra |
| 4 | Trần Bình Trọng | 25410324 | Borrowing Core |
| 5 | Lê Thanh Quốc | 25410289 | Fines & AI |

## 🚀 Công nghệ sử dụng

- **Backend:** Python 3.12+, FastAPI, SQLAlchemy Async, Alembic; quản lý package bằng `uv`.
- **Frontend:** React 19, TypeScript 6, Vite 8, React Router, TanStack Query và Zustand.
- **Cơ sở dữ liệu:** PostgreSQL kết hợp `pg_trgm`, `pgvector` và SQLAlchemy ORM.
- **AI:** Sentence Transformers (`paraphrase-multilingual-MiniLM-L12-v2`) tạo embedding đa ngôn ngữ 384 chiều. Tìm kiếm dùng cosine distance trong PostgreSQL; gợi ý cá nhân hóa dựa trên lịch sử mượn và fallback theo độ phổ biến. Dự án hiện không dùng API Groq.

Tài liệu chi tiết:

- [Backend README](backend/README.md): kiến trúc, database, API, xác thực, AI, seed và kiểm thử.
- [Frontend README](frontend/README.md): chức năng, routing, phân quyền, HTTP client và build.

## 📂 Cấu trúc monorepo

```text
ie221-smart-library-management/
├── .github/                  # GitHub Actions
├── backend/
│   ├── alembic/              # Database migrations
│   ├── app/
│   │   ├── api/              # FastAPI routers và dependencies
│   │   ├── core/             # Settings, security, errors, OpenAPI
│   │   ├── db/               # Base model, mixin và AsyncSession
│   │   ├── models/           # SQLAlchemy models
│   │   ├── repositories/     # Data-access layer
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic
│   │   ├── scripts/          # Seed, AI indexing và cleanup
│   │   └── main.py           # FastAPI application
│   ├── tests/                # Unit test và kiểm tra DB thủ công
│   ├── .env.example
│   ├── pyproject.toml
│   └── README.md
├── frontend/
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Component dùng chung và UI primitives
│   │   ├── features/         # Module theo tính năng
│   │   ├── layouts/          # Application layouts
│   │   ├── lib/              # Axios, query client và utilities
│   │   ├── pages/            # User, admin và auth pages
│   │   ├── router/           # Routes và middleware
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── docs/                     # Báo cáo, slide và kê khai AI
├── package.json              # Scripts chạy monorepo
└── README.md
```

## 🛠 Cài đặt và chạy dự án

### 1. Yêu cầu hệ thống

- Python >= 3.12.
- Node.js >= 22.
- `uv` package manager.
- PostgreSQL có extension `pg_trgm` và `vector` (pgvector).
- Git.

### 2. Cấu hình môi trường

Tạo hai file môi trường từ mẫu:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Trên PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

Cập nhật tối thiểu trong `backend/.env`:

```env
DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/library_db"
SECRET_KEY="your-random-secret-key"
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
COOKIE_SECURE=false
```

Frontend mặc định sử dụng:

```env
VITE_API_URL="http://localhost:8000/api/v1"
```

Không commit các file `.env`. Khi production chạy qua HTTPS, đặt `COOKIE_SECURE=true`.

### 3. Cài dependency và migration

Từ thư mục gốc:

```bash
npm install
npm run install:all
cd backend
uv run alembic upgrade head
cd ..
```

Migration sẽ bật các extension PostgreSQL cần thiết; tài khoản database chạy migration phải có quyền tương ứng.

### 4. Chạy đồng thời backend và frontend

```bash
npm run dev
```

| Dịch vụ | Địa chỉ |
| :--- | :--- |
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8000` |
| Scalar API Docs | `http://localhost:8000/docs` |
| OpenAPI JSON | `http://localhost:8000/api/v1/openapi.json` |
| Health check | `http://localhost:8000/heathz` |

> `npm run dev` chỉ khởi chạy hai development server; lệnh này không tự tạo `.env`, database hoặc chạy migration.

### 5. Chạy từng phân hệ

Backend:

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run fastapi dev
```

Frontend, trong terminal khác:

```bash
cd frontend
npm install
npm run dev
```

## 🌱 Dữ liệu demo

Sau khi migration thành công, tạo dữ liệu minh họa cho catalog, dashboard, mượn trả và tài khoản:

```bash
cd backend
uv run python -m app.scripts.seed_demo
```

Dùng `--skip-ai` nếu chưa muốn tải model Sentence Transformer. Có thể index sau bằng `uv run python -m app.scripts.index_demo_ai`.

| Vai trò | Email | Mật khẩu mặc định |
| :--- | :--- | :--- |
| Admin | `demo.admin@example.com` | `Demo123!@#` |
| User | `demo.minhanh@example.com` | `Demo123!@#` |
| User | `demo.giahuy@example.com` | `Demo123!@#` |

Có thể thay mật khẩu seed bằng biến `DEMO_DEFAULT_PASSWORD`. Script mặc định từ chối chạy khi `ENVIRONMENT=production` hoặc `prod`.

## ✅ Kiểm tra dự án

Backend:

```bash
cd backend
uv run python -m unittest discover -s tests -v
uv run ruff check .
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## 🤝 Quy trình làm việc nhóm

1. Không push trực tiếp lên nhánh `main`.
2. Tạo nhánh `feature/ten-tinh-nang` hoặc `fix/ten-loi`.
3. Commit rõ ràng, ví dụ `[Backend]: Thêm API mượn sách` hoặc `[Frontend]: Hoàn thiện UI trang chủ`.
4. Tạo Pull Request để thành viên khác review trước khi merge.
