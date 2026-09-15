# ⚙️ Backend — Smart Library Management

API server cho hệ thống **Quản Lý Thư Viện & Mượn Trả Sách Thông Minh** (Smart Library Management), được xây dựng trên nền tảng **FastAPI**, **SQLAlchemy 2.0 (Async)**, và **PostgreSQL**.

---

## 🌟 Chức năng nổi bật

- **Kiến trúc Layered Architecture (Phân tầng rõ ràng)**: Phân chia rõ ràng giữa Router (API) ➔ Service (Business Logic) ➔ Repository (Data Access) ➔ Schema (Pydantic) ➔ Model (SQLAlchemy ORM).
- **Hệ thống Xác thực & Phân quyền (Auth & RBAC)**:
  - Mã hóa mật khẩu an toàn với **Argon2** (thông qua `pwdlib`).
  - Cấp phát **JWT Access Token** (truyền qua header `Authorization: Bearer <token>`).
  - Quản lý **Refresh Token Rotation** bảo mật với HTTP-only Cookie (`samesite="lax"`, `secure`), lưu hash SHA-256 trong CSDL.
  - Phân quyền theo vai trò (Role-Based Access Control - RBAC) với 2 vai trò chính: `ADMIN` và `USER`.
  - Hỗ trợ đổi mật khẩu, tự động thu hồi (revoke) toàn bộ phiên đăng nhập trên các thiết bị khác.
- **Quản lý Tài khoản & Trạng thái User**:
  - API lấy thông tin cá nhân (`GET /api/v1/users/me`).
  - Quản trị viên (Admin) có quyền khóa (`LOCKED`) hoặc mở khóa (`ACTIVE`) tài khoản người dùng, lập tức thu hồi mọi Refresh Token đang hoạt động.
- **Xử lý Lỗi Chuẩn hóa & Custom OpenAPI Docs**:
  - Hệ thống ngoại lệ domain (`DomainError`, `InvalidCredentialsError`, `EmailAlreadyExistsError`, `InvalidTokenError`, `UserNotFoundError`, `InsufficientPermissionError`).
  - Bắt lỗi validation input (422) và trả về định dạng tiếng Việt chuẩn hóa (`ErrorResponse` & `FieldError`).
  - Tích hợp giao diện tài liệu API trực quan hiện đại **Scalar UI** tại `/docs` và tùy chỉnh OpenAPI schema linh hoạt.
- **Mô hình Dữ liệu Thư viện Toàn diện (13 Entities)**:
  - Quản lý danh mục (`categories`), nhà xuất bản (`publishers`), tác giả (`authors`), sách (`books`), liên kết tác giả - sách (`book_authors`).
  - Quản lý mượn/trả sách (`borrow_records`, `borrow_items`), đặt trước sách (`reservations`, `reservation_items`), tiền phạt quá hạn (`fines`).
  - Đăng ký nhật ký tìm kiếm AI (`ai_search_logs` hỗ trợ lưu JSONB result).
  - Tối ưu hóa truy vấn tìm kiếm tiêu đề sách với **PostgreSQL GIN Trigram Index** (`gin_trgm_ops`).

---

## 🚀 Công nghệ sử dụng

| Công nghệ                                              | Phiên bản  | Mục đích                                            |
| :----------------------------------------------------- | :--------: | :-------------------------------------------------- |
| [Python](https://www.python.org/)                      |  `>=3.12`  | Ngôn ngữ lập trình chính                            |
| [FastAPI](https://fastapi.tiangolo.com/)               | `>=0.141`  | Web framework bất đồng bộ (async)                   |
| [SQLAlchemy](https://www.sqlalchemy.org/)              | `>=2.0.52` | ORM với AsyncEngine & AsyncSession                  |
| [PostgreSQL](https://www.postgresql.org/)              |     —      | Hệ quản trị cơ sở dữ liệu quan hệ                   |
| [asyncpg](https://github.com/MagicStack/asyncpg)       | `>=0.31.0` | Driver PostgreSQL bất đồng bộ hiệu năng cao         |
| [Alembic](https://alembic.sqlalchemy.org/)             | `>=1.19.1` | Quản lý database migration                          |
| [PyJWT](https://pyjwt.readthedocs.io/)                 | `>=2.13.0` | Tạo và xác thực JSON Web Token                      |
| [pwdlib](https://github.com/frankie567/pwdlib)         | `>=0.3.1`  | Mã hóa & băm mật khẩu chuẩn Argon2                  |
| [Pydantic Settings](https://docs.pydantic.dev/latest/) |     —      | Đọc và validate biến môi trường từ `.env`           |
| [Scalar FastAPI](https://scalar.com/)                  | `>=1.8.2`  | Giao diện API Documentation (Scalar UI)             |
| [uv](https://docs.astral.sh/uv/)                       |     —      | Công cụ quản lý package & venv siêu nhanh bằng Rust |

---

## 🏗️ Kiến trúc & Cấu trúc thư mục

### Mẫu kiến trúc (Layered Architecture)

```text
HTTP Request ──► CORS / Middleware ──► API Router (v1)
                                            │
                                            ▼
                                     Service Layer (Business Logic)
                                            │
                                            ▼
                                  Repository Layer (Data Access)
                                            │
                                            ▼
                                  SQLAlchemy AsyncSession ──► PostgreSQL
```

### Cấu trúc dự án

```text
backend/
├── app/                        # Mã nguồn chính của ứng dụng
│   ├── api/                    # Tầng API Controllers & Endpoints
│   │   ├── v1/                 # API Version 1
│   │   │   ├── auth/           # Endpoints đăng ký, đăng nhập, refresh, logout, đổi mật khẩu
│   │   │   │   ├── deps.py     # Dependency riêng cho AuthService
│   │   │   │   └── router.py
│   │   │   ├── users/          # Endpoints người dùng (profile me, lock, unlock)
│   │   │   │   ├── deps.py     # Dependency riêng cho UserService
│   │   │   │   └── router.py
│   │   │   └── router.py       # Main Router gom tất cả v1 modules
│   │   └── deps.py             # Common API Dependencies (get_db, CurrentUser, require_admin)
│   ├── core/                   # Cấu hình cốt lõi & Tiện ích chung
│   │   ├── config.py           # Class Settings đọc biến môi trường
│   │   ├── exceptions.py       # Các lớp ngoại lệ Domain (DomainError, InvalidCredentials, ...)
│   │   ├── openapi.py          # Custom OpenAPI schema generator (override 422 response)
│   │   └── security.py         # Hàm băm mật khẩu Argon2, JWT token, SHA-256 refresh hash
│   ├── db/                     # Quản lý kết nối CSDL & Base models
│   │   ├── base.py             # Declarative Base với Naming Convention (pk, fk, uq, ix, ck)
│   │   ├── mixins.py           # Repositories reusable mixins (UUIDPkMixin, TimestampMixin, CreatedAtMixin)
│   │   └── session.py          # Async Engine, AsyncSessionLocal & get_db dependency
│   ├── models/                 # SQLAlchemy ORM Models (Bảng CSDL)
│   │   ├── user.py             # User & UserRole/UserStatus Enums
│   │   ├── refresh_token.py    # RefreshToken lưu hash token & trạng thái revoked
│   │   ├── category.py         # Danh mục sách
│   │   ├── publisher.py        # Nhà xuất bản
│   │   ├── author.py           # Tác giả
│   │   ├── book.py             # Sách (tích hợp GIN Trigram index)
│   │   ├── book_author.py      # Bảng trung gian Sách - Tác giả
│   │   ├── borrow_record.py    # Phếu mượn sách & BorrowStatus Enum
│   │   ├── borrow_item.py      # Chi tiết mượn sách
│   │   ├── reservation.py      # Phiếu đặt trước & ReservationStatus Enum
│   │   ├── reservation_item.py # Chi tiết đặt trước
│   │   ├── fine.py             # Tiền phạt quá hạn & PaymentStatus Enum
│   │   └── ai_search_log.py    # Lịch sử tìm kiếm AI (JSONB)
│   ├── repositories/           # Tầng Truy vấn CSDL (CRUD Data Access)
│   │   ├── user_repository.py          # Thao tác CSDL cho User
│   │   └── refresh_token_repository.py # Thao tác CSDL cho RefreshToken
│   ├── schemas/                # Pydantic Schemas (Request/Response Validation)
│   │   ├── auth.py             # Schema Login, ChangePassword
│   │   ├── user.py             # Schema CreateUser, UserRead
│   │   ├── token.py            # Schema Token, TokenPair, TokenPayload
│   │   └── error.py            # Schema ErrorResponse, FieldError
│   ├── services/               # Tầng Nghiệp vụ (Business Logic)
│   │   ├── auth_service.py     # Xử lý login, register, issue/refresh token, logout, change password
│   │   └── user_service.py     # Xử lý lock/unlock tài khoản
│   └── main.py                 # FastAPI Application Entry Point
├── alembic/                    # Database Migrations
│   ├── versions/               # Các tệp script migration
│   ├── env.py                  # Alembic environment config (kết nối target_metadata = Base.metadata)
│   └── script.py.mako          # Template script migration
├── alembic.ini                 # Cấu hình Alembic
├── pyproject.toml              # Cấu hình dự án & dependencies (uv)
├── uv.lock                     # Lock file cố định phiên bản gói
├── .python-version             # Khai báo phiên bản Python (3.12)
├── .env.example                # File mẫu biến môi trường
└── README.md                   # Tài liệu hướng dẫn sử dụng
```

---

## 🗃️ Cơ sở dữ liệu & Các bảng chính (Entities)

Hệ thống được thiết kế chuẩn mực với 13 bảng dữ liệu quan hệ:

1. **`users`**: Quản lý thông tin tài khoản người dùng, vai trò (`admin`, `user`), trạng thái (`active`, `locked`).
2. **`refresh_tokens`**: Lưu trữ chuỗi hash SHA-256 của Refresh Token, thời gian hết hạn và trạng thái thu hồi (`revoked`).
3. **`categories`**: Danh mục phân loại sách.
4. **`publishers`**: Thông tin các nhà xuất bản.
5. **`authors`**: Thông tin các tác giả.
6. **`books`**: Thông tin chi tiết sách, số lượng tổng/sẵn có, mã ISBN, và chỉ mục GIN Trigram cho tìm kiếm tiêu đề.
7. **`book_authors`**: Bảng liên kết nhiều-nhiều giữa Sách và Tác giả.
8. **`borrow_records`**: Phiếu mượn sách, quản lý ngày mượn, hạn trả, ngày trả thực tế và trạng thái (`borrowing`, `returned`, `overdue`).
9. **`borrow_items`**: Danh sách các cuốn sách thuộc một phiếu mượn.
10. **`reservations`**: Phiếu đặt giữ sách trước, trạng thái (`pending`, `approved`, `cancelled`, `expired`).
11. **`reservation_items`**: Danh sách sách đặt giữ trong một phiếu đặt.
12. **`fines`**: Thông tin tiền phạt do trả sách quá hạn, số ngày quá hạn, số tiền phạt và trạng thái thanh toán (`unpaid`, `paid`).
13. **`ai_search_logs`**: Nhật ký tìm kiếm bằng AI của người dùng (lưu câu truy vấn và mảng ID sách kết quả dưới dạng `JSONB`).

---

## 🛠️ Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Yêu cầu môi trường

- **Python** `>= 3.12`
- **uv** (Package manager): [Hướng dẫn cài đặt uv](https://docs.astral.sh/uv/getting-started/installation/)
- **PostgreSQL** Server đang hoạt động

### 2. Các bước khởi chạy

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Đồng bộ và cài đặt toàn bộ dependencies (uv tự động tạo .venv)
uv sync

# 3. Kích hoạt môi trường ảo (Virtual Environment)
# Trên Windows (PowerShell / CMD):
.venv\Scripts\activate
# Trên macOS / Linux:
source .venv/bin/activate

# 4. Tạo file cấu hình môi trường từ mẫu
cp .env.example .env

# 5. Cập nhật các thông số kết nối Database & Secret Key trong file .env

# 6. Chạy Migration để tạo cấu trúc bảng trong PostgreSQL
alembic upgrade head

# 7. Khởi chạy server ở chế độ Development
uv run fastapi dev
```

Server sẽ khởi chạy tại: **`http://localhost:8000`**

Giao diện tài liệu API (Scalar UI): **`http://localhost:8000/docs`**

---

## ⚙️ Cấu hình Biến môi trường (`.env`)

Các cấu hình chính trong file `.env`:

### App Settings

| Biến môi trường        | Mô tả                                       | Giá trị mặc định                   |
| :--------------------- | :------------------------------------------ | :--------------------------------- |
| `PROJECT_NAME`         | Tên ứng dụng                                | `Smart Library Management Backend` |
| `API_V1_PREFIX`        | Đường dẫn prefix cho API v1                 | `/api/v1`                          |
| `ENVIRONMENT`          | Môi trường vận hành (`local`/`production`)  | `local`                            |
| `BACKEND_CORS_ORIGINS` | Danh sách origin cho phép CORS (JSON array) | `["http://localhost:5173"]`        |

### Security Settings

| Biến môi trường               | Mô tả                                                         | Giá trị mặc định |
| :---------------------------- | :------------------------------------------------------------ | :--------------- |
| `SECRET_KEY`                  | Khóa bí mật dùng ký JWT (Tạo bằng `openssl rand -hex 32`)     | _Bắt buộc_       |
| `ALGORITHM`                   | Thuật toán mã hóa JWT                                         | `HS256`          |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Thời gian sống của Access Token (phút)                        | `30`             |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | Thời gian sống của Refresh Token (ngày)                       | `7`              |
| `COOKIE_SECURE`               | Bật Secure Cookie (Đặt `True` khi chạy HTTPS trên Production) | `False`          |

### Database Settings

| Biến môi trường | Mô tả                                               | Định dạng mẫu                                                  |
| :-------------- | :-------------------------------------------------- | :------------------------------------------------------------- |
| `DATABASE_URL`  | Chuỗi kết nối PostgreSQL Async via `asyncpg` driver | `postgresql+asyncpg://user:password@localhost:5432/library_db` |

---

## 🗃️ Hướng dẫn Quản lý Database Migration (Alembic)

Các lệnh Alembic thường dùng:

```bash
# Tạo script migration mới khi thay đổi SQLAlchemy Models
alembic revision --autogenerate -m "Mô tả thay đổi schema"

# Áp dụng tất cả migration chưa chạy lên CSDL
alembic upgrade head

# Rollback 1 bước migration gần nhất
alembic downgrade -1

# Kiểm tra lịch sử các bản migration
alembic history
```

---

## 📡 Danh sách API Endpoints hiện tại

### System & Documentation

| Method | Endpoint               | Mô tả                                                   | Xác thực |
| :----- | :--------------------- | :------------------------------------------------------ | :------: |
| `GET`  | `/heathz`              | Kiểm tra trạng thái hoạt động của server (Health check) |  Không   |
| `GET`  | `/docs`                | Giao diện tài liệu API tương tác (Scalar UI)            |  Không   |
| `GET`  | `/api/v1/openapi.json` | Khai báo OpenAPI Schema chuẩn chỉnh                     |  Không   |

### Authentication (`/api/v1/auth`)

| Method | Endpoint                       | Mô tả                                                                     | Xác thực |
| :----- | :----------------------------- | :------------------------------------------------------------------------ | :------: |
| `POST` | `/api/v1/auth/register`        | Đăng ký tài khoản người dùng mới (`201 Created`)                          |  Không   |
| `POST` | `/api/v1/auth/login`           | Đăng nhập, nhận Access Token (body) & Refresh Token (HTTP-only cookie)    |  Không   |
| `POST` | `/api/v1/auth/refresh`         | Cấp lại Access Token & xoay vòng Refresh Token từ HTTP-only cookie        |  Cookie  |
| `POST` | `/api/v1/auth/logout`          | Đăng xuất, thu hồi Refresh Token trong DB & xóa cookie (`204 No Content`) |  Cookie  |
| `POST` | `/api/v1/auth/change-password` | Đổi mật khẩu & vô hiệu hóa phiên đăng nhập trên mọi thiết bị khác         |  Bearer  |

### User Management (`/api/v1/users`)

| Method  | Endpoint                         | Mô tả                                                           | Phân quyền  |
| :------ | :------------------------------- | :-------------------------------------------------------------- | :---------: |
| `GET`   | `/api/v1/users/me`               | Lấy thông tin chi tiết của người dùng đang đăng nhập            | CurrentUser |
| `PATCH` | `/api/v1/users/{user_id}/lock`   | Khóa tài khoản người dùng & lập tức thu hồi các phiên đăng nhập |   `ADMIN`   |
| `PATCH` | `/api/v1/users/{user_id}/unlock` | Mở khóa tài khoản người dùng về trạng thái `ACTIVE`             |   `ADMIN`   |

---

## 🔒 Quy trình Bảo mật & Luồng Xác thực

1. **Đăng nhập (`POST /auth/login`)**:
   - Client gửi `email` và `password`.
   - Server kiểm tra thông tin đăng nhập với mật khẩu mã hóa **Argon2** trong DB.
   - Nếu hợp lệ, server trả về `access_token` trong JSON response body và tự động đặt `refresh_token` ngẫu nhiên 32-bytes vào **HTTP-only Cookie** bảo mật.
   - Bản băm SHA-256 của `refresh_token` được lưu vào bảng `refresh_tokens`.
2. **Gọi API cần bảo mật**:
   - Client gắn Access Token vào header request: `Authorization: Bearer <access_token>`.
3. **Làm mới Token (`POST /auth/refresh`)**:
   - Khi Access Token hết hạn (sau 30 phút), client gọi API `/refresh`.
   - Trình duyệt tự động gửi cookie `refresh_token`. Server kiểm tra tính hợp lệ và trạng thái `revoked`.
   - Thu hồi Refresh Token cũ, cấp phát một cặp (Access Token + Refresh Token) hoàn toàn mới (**Token Rotation**).
4. **Đổi mật khẩu / Khóa tài khoản**:
   - Khi user đổi mật khẩu hoặc bị Admin khóa tài khoản, toàn bộ các bản ghi `refresh_tokens` thuộc user đó sẽ bị chuyển thành `revoked = True`, buộc người dùng phải đăng nhập lại trên tất cả thiết bị.
