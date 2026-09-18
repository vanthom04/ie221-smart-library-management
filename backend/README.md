# ⚙️ Backend — Smart Library Management

API server cho hệ thống **Quản Lý Thư Viện & Mượn Trả Sách Thông Minh** (Smart Library Management), được xây dựng trên nền tảng **FastAPI**, **SQLAlchemy 2.0 (Async)**, và **PostgreSQL**.

---

## Tiến độ triển khai


| Phân hệ | Đã triển khai | Phần còn thiếu / giới hạn |
| :--- | :--- | :--- |
| Auth & User | Đăng ký/đăng nhập, JWT, refresh rotation, logout, đổi mật khẩu, hồ sơ cá nhân, khóa/mở khóa, RBAC | Chưa có API danh sách user, sửa hồ sơ, quản lý vai trò |
| Borrowing | Đặt trước, duyệt/từ chối/hủy/hết hạn, mượn trực tiếp/từ phiếu đặt, trả, gia hạn, lịch sử cá nhân và danh sách admin | Trả toàn bộ phiếu; chưa có scheduler hết hạn |
| Upload | JPEG, PNG, WebP lên Cloudinary, kiểm tra Content-Type/dung lượng | Endpoint chưa yêu cầu đăng nhập; không hỗ trợ GIF trong whitelist |
| AI | Embedding đa ngôn ngữ, indexing, semantic search, gợi ý từ lịch sử mượn | Có lỗi nối dependency indexing, chi tiết bên dưới |
| Catalog | Model/migration sách, tác giả, danh mục, nhà xuất bản | Chưa có API CRUD catalog |
| Fines & Dashboard | Model/migration tiền phạt | Chưa có nghiệp vụ tính/thu phạt hoặc API dashboard |
| AI logs | Model/migration `ai_search_logs` | Search chưa ghi nhật ký |
| Hạ tầng | Async DB, migration, CORS, lỗi chuẩn hóa, Scalar, cleanup token, 8 unit test borrowing/transaction | Chưa có test AI/auth/upload hoặc test tích hợp DB trong `tests/` |

## 🌟 Chức năng nổi bật

- **Kiến trúc Layered Architecture (Phân tầng rõ ràng)**: Phân chia rõ ràng giữa Router (API) ➔ Service (Business Logic) ➔ Repository (Data Access) ➔ Schema (Pydantic) ➔ Model (SQLAlchemy ORM).
- **Hệ thống Xác thực & Phân quyền (Auth & RBAC)**:
  - Mã hóa mật khẩu an toàn với **Argon2** (thông qua `pwdlib`).
  - Cấp phát **JWT Access Token** (truyền qua header `Authorization: Bearer <token>`).
  - Quản lý **Refresh Token Rotation** bảo mật với HTTP-only Cookie (`samesite="lax"`, `secure`), lưu hash SHA-256 trong CSDL.
  - Phân quyền theo vai trò (Role-Based Access Control - RBAC) với 2 vai trò chính: `ADMIN` và `USER`.
  - Hỗ trợ đổi mật khẩu, thu hồi toàn bộ refresh token. Access token đã cấp vẫn có thể dùng đến khi hết hạn nếu tài khoản còn hoạt động.
- **Quản lý Tài khoản & Trạng thái User**:
  - API lấy thông tin cá nhân (`GET /api/v1/users/me`).
  - Quản trị viên (Admin) có quyền khóa (`LOCKED`) hoặc mở khóa (`ACTIVE`) tài khoản người dùng, lập tức thu hồi mọi Refresh Token đang hoạt động.
- **Xử lý Lỗi Chuẩn hóa & Custom OpenAPI Docs**:
  - Hệ thống ngoại lệ domain (`DomainError`, `InvalidCredentialsError`, `EmailAlreadyExistsError`, `InvalidTokenError`, `UserNotFoundError`, `InsufficientPermissionError`).
  - Bắt lỗi validation input (422) và trả về định dạng tiếng Việt chuẩn hóa (`ErrorResponse` & `FieldError`).
  - Tích hợp giao diện tài liệu API trực quan hiện đại **Scalar UI** tại `/docs` và tùy chỉnh OpenAPI schema linh hoạt.
- **Mô hình Dữ liệu Thư viện Toàn diện (14 Entities)**:
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
├── app/
│   ├── api/v1/         # auth, users, borrowing, uploads, ai
│   ├── core/           # Settings, security, errors, OpenAPI, Cloudinary
│   ├── db/             # AsyncSession, Base, mixins
│   ├── models/         # 14 bảng ORM, bao gồm book_embeddings
│   ├── repositories/   # User, refresh token, borrowing, AI search
│   ├── schemas/        # Request/response Pydantic
│   ├── services/       # Auth, user, borrowing, embedding, indexing, search, recommendation
│   ├── scripts/        # cleanup_refresh_tokens.py
│   └── main.py
├── alembic/versions/   # Migration schema và extension PostgreSQL
├── tests/              # Unit test borrowing/transaction
├── alembic.ini
├── pyproject.toml
├── uv.lock
├── .python-version
├── .env.example
└── README.md
```

---

## 🗃️ Cơ sở dữ liệu & Các bảng chính (Entities)

Hệ thống được thiết kế chuẩn mực với 14 bảng dữ liệu quan hệ:

1. **`users`**: Quản lý thông tin tài khoản người dùng, vai trò (`admin`, `user`), trạng thái (`active`, `locked`).
2. **`refresh_tokens`**: Lưu trữ chuỗi hash SHA-256 của Refresh Token, thời gian hết hạn và trạng thái thu hồi (`revoked`).
3. **`categories`**: Danh mục phân loại sách.
4. **`publishers`**: Thông tin các nhà xuất bản.
5. **`authors`**: Thông tin các tác giả.
6. **`books`**: Thông tin chi tiết sách, số lượng tổng/sẵn có, mã ISBN, và chỉ mục GIN Trigram cho tìm kiếm tiêu đề.
7. **`book_authors`**: Bảng liên kết nhiều-nhiều giữa Sách và Tác giả.
8. **`borrow_records`**: Phiếu mượn sách, quản lý ngày mượn, hạn trả, ngày trả thực tế và trạng thái (`borrowing`, `returned`, `overdue`).
9. **`borrow_items`**: Danh sách các cuốn sách thuộc một phiếu mượn.
10. **`reservations`**: Phiếu đặt giữ sách trước, trạng thái (`pending`, `approved`, `rejected`, `fulfilled`, `cancelled`, `expired`).
11. **`reservation_items`**: Danh sách sách đặt giữ trong một phiếu đặt.
12. **`fines`**: Thông tin tiền phạt do trả sách quá hạn, số ngày quá hạn, số tiền phạt và trạng thái thanh toán (`unpaid`, `paid`).
13. **`ai_search_logs`**: Nhật ký tìm kiếm bằng AI của người dùng (lưu câu truy vấn và mảng ID sách kết quả dưới dạng `JSONB`).
14. **`book_embeddings`**: Mỗi sách có một vector 384 chiều, nội dung metadata, tên model, hash SHA-256 và thời gian cập nhật; xóa theo sách qua khóa ngoại.

---

## 🛠️ Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Yêu cầu môi trường

- **Python** `>= 3.12`
- **uv** (Package manager): [Hướng dẫn cài đặt uv](https://docs.astral.sh/uv/getting-started/installation/)
- **PostgreSQL** đang hoạt động, có sẵn extension `pg_trgm` và `vector` (pgvector); tài khoản migration cần quyền tạo extension.

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

# 5. Điền DATABASE_URL, SECRET_KEY riêng và các biến CLOUDINARY_* trong .env
# COOKIE_SECURE=false khi chạy HTTP local; cấu hình CORS cho frontend

# 6. Chạy Migration để tạo cấu trúc bảng trong PostgreSQL
uv run alembic upgrade head

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
| `BACKEND_CORS_ORIGINS` | Danh sách origin cho phép CORS (JSON array) | `[]` (file mẫu dùng localhost:5173)        |

### Security Settings

| Biến môi trường               | Mô tả                                                         | Giá trị mặc định |
| :---------------------------- | :------------------------------------------------------------ | :--------------- |
| `SECRET_KEY`                  | Khóa bí mật dùng ký JWT (Tạo bằng `openssl rand -hex 32`)     | _Bắt buộc_       |
| `ALGORITHM`                   | Thuật toán mã hóa JWT                                         | `HS256`          |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Thời gian sống của Access Token (phút)                        | `30`             |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | Thời gian sống của Refresh Token (ngày)                       | `7`              |
| `COOKIE_SECURE`               | Bật Secure Cookie (Đặt `True` khi chạy HTTPS trên Production) | `True` (file mẫu đặt `false` cho HTTP local)          |

### Database Settings

| Biến môi trường | Mô tả                                               | Định dạng mẫu                                                  |
| :-------------- | :-------------------------------------------------- | :------------------------------------------------------------- |
| `DATABASE_URL`  | Chuỗi kết nối PostgreSQL Async via `asyncpg` driver | `postgresql+asyncpg://user:password@localhost:5432/library_db` |

---

## 🗃️ Hướng dẫn Quản lý Database Migration (Alembic)

Các lệnh Alembic thường dùng:

```bash
# Tạo script migration mới khi thay đổi SQLAlchemy Models
uv run alembic revision --autogenerate -m "Mô tả thay đổi schema"

# Áp dụng tất cả migration chưa chạy lên CSDL
uv run alembic upgrade head

# Rollback 1 bước migration gần nhất
uv run alembic downgrade -1

# Kiểm tra lịch sử các bản migration
uv run alembic history
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

### Borrowing Core (`/api/v1`)

| Method   | Endpoint                                                   | Mô tả                                      | Phân quyền  |
| :------- | :--------------------------------------------------------- | :----------------------------------------- | :---------: |
| `POST`   | `/api/v1/reservations`                                     | Tạo phiếu đặt trước                        |    User     |
| `GET`    | `/api/v1/reservations/me`                                  | Xem các phiếu đặt trước của bản thân       |    User     |
| `DELETE` | `/api/v1/reservations/{reservation_id}`                    | Hủy phiếu đang chờ hoặc đã duyệt           | Owner/Admin |
| `GET`    | `/api/v1/reservations`                                     | Danh sách phiếu, có thể lọc theo trạng thái |   `ADMIN`   |
| `PATCH`  | `/api/v1/reservations/{reservation_id}/approve`            | Duyệt và giữ tồn kho                       |   `ADMIN`   |
| `PATCH`  | `/api/v1/reservations/{reservation_id}/reject`             | Từ chối phiếu kèm lý do                    |   `ADMIN`   |
| `POST`   | `/api/v1/reservations/expire`                              | Giải phóng các phiếu giữ chỗ hết hạn       |   `ADMIN`   |
| `POST`   | `/api/v1/borrow-records`                                   | Lập phiếu mượn trực tiếp                   |   `ADMIN`   |
| `POST`   | `/api/v1/borrow-records/from-reservation/{reservation_id}` | Chuyển phiếu đã duyệt thành phiếu mượn     |   `ADMIN`   |
| `GET`    | `/api/v1/borrow-records/me`                                | Xem lịch sử mượn trả của bản thân          |    User     |
| `GET`    | `/api/v1/borrow-records`                                   | Xem toàn bộ phiếu mượn                     |   `ADMIN`   |
| `PATCH`  | `/api/v1/borrow-records/{borrow_id}/renew`                 | Gia hạn phiếu mượn                         | Owner/Admin |
| `PATCH`  | `/api/v1/borrow-records/{borrow_id}/return`                | Xác nhận trả sách và hoàn tồn kho          |   `ADMIN`   |

Mỗi thao tác thay đổi phiếu và tồn kho chạy trong cùng một database transaction. Các hàng
`books` được khóa bằng `SELECT ... FOR UPDATE` để tránh tồn kho âm khi có yêu cầu đồng thời.

Các quy tắc thời gian có thể cấu hình bằng `RESERVATION_HOLD_DAYS`, `BORROW_DAYS`,
`RENEWAL_DAYS` và `MAX_RENEWALS` trong file `.env`.

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
   - Khi user đổi mật khẩu hoặc bị Admin khóa tài khoản, toàn bộ các bản ghi `refresh_tokens` thuộc user đó sẽ bị chuyển thành `revoked = True`, ngăn cấp token mới từ các refresh token cũ. Đổi mật khẩu không thu hồi ngay access token đã cấp; khóa tài khoản bị chặn ngay bởi dependency kiểm tra trạng thái user.


## Upload và cấu hình nghiệp vụ

`POST /api/v1/uploads/image` nhận multipart trường `file`, trả `url` HTTPS và `public_id`; hiện không yêu cầu xác thực. Whitelist thực tế chỉ gồm JPEG, PNG, WebP.

| Biến `.env` | Mặc định / yêu cầu |
| :--- | :--- |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Bắt buộc có trong Settings; điền thông tin hợp lệ để upload |
| `CLOUDINARY_UPLOAD_FOLDER` | `smart-library-management` |
| `MAX_UPLOAD_SIZE_MB` | `5` |
| `RESERVATION_HOLD_DAYS` | `3` ngày |
| `BORROW_DAYS` | `14` ngày |
| `RENEWAL_DAYS` | `7` ngày |
| `MAX_RENEWALS` | `1` lần |

Duyệt phiếu đặt giữ tồn kho; chuyển sang phiếu mượn không trừ kho lần nữa. Hủy/hết hạn phiếu đã duyệt và trả sách hoàn tồn kho. Gia hạn bị chặn khi phiếu đã trả/quá hạn, hết số lần gia hạn hoặc có độc giả khác chờ sách.

## AI: tìm kiếm và gợi ý sách

AI dùng **Sentence Transformers + NumPy + PostgreSQL/pgvector**, chạy embedding tại backend; hiện không tích hợp Groq hoặc LLM sinh nội dung.

- **Embedding:** `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`, vector chuẩn hóa 384 chiều, mặc định CPU. Model được nạp khi dependency embedding dùng lần đầu và có thể cần tải nếu chưa có cache. Encode chạy qua `asyncio.to_thread`.
- **Indexing:** ghép tiêu đề, tác giả, danh mục, nhà xuất bản, ISBN, mô tả; tính hash SHA-256, bỏ qua nội dung không đổi và upsert vào `book_embeddings`. Hỗ trợ một sách hoặc toàn bộ catalog.
- **Search:** embedding truy vấn rồi xếp hạng cosine distance trong PostgreSQL; score là `1 - distance`. Chỉ tìm sách đã có embedding; chưa có ngưỡng điểm hoặc lọc tồn kho.
- **Recommendations:** lấy các sách khác nhau trong lịch sử mượn, tính vector trung bình, xếp hạng cosine similarity bằng NumPy và loại sách đã mượn. Nếu thiếu lịch sử/vector phù hợp hoặc không có ứng viên, dùng độ phổ biến theo tổng số lượng sách đã mượn. Lý do gợi ý là chuỗi cố định.

### API AI

| Method | Endpoint | Quyền | Request / response |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/ai/search` | Công khai | `query`: 1–500 ký tự; `limit`: 1–20, mặc định 5. Trả `query`, `results`, `total` |
| `POST` | `/api/v1/ai/index-books` | Admin | Body `{}` index toàn bộ hoặc `{"book_id":"<UUID>"}` index một sách. Trả `message`, `total_checked`, `indexed`, `skipped` |
| `GET` | `/api/v1/ai/recommendations?limit=3` | CurrentUser | `limit`: 1–20, mặc định 3. Trả `based_on_books`, `recommendations` với metadata, `rank`, `score`, `reason` |

Ví dụ body tìm kiếm trong Scalar `/docs`:

```json
{
  "query": "Sách nhập môn lập trình Python cho người mới bắt đầu",
  "limit": 5
}
```

### Cấu hình AI

Đã khai báo trong `app/core/config.py`, chưa có trong `.env.example`; thêm vào `.env` khi cần ghi đè.

| Biến | Mặc định |
| :--- | :--- |
| `AI_EMBEDDING_MODEL_NAME` | `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` |
| `AI_EMBEDDING_DIMENSION` | `384` |
| `AI_EMBEDDING_DEVICE` | `cpu` |
| `AI_EMBEDDING_BATCH_SIZE` | `32` |
| `AI_SEARCH_TOP_K` | `5`; hiện chưa được service/schema sử dụng, request `limit` quyết định số kết quả |

Migration `161868ae43c2` tạo extension `vector` và cột `VECTOR(384)`. Đổi số chiều cần migration tương ứng. Indexing chỉ so sánh hash nội dung, nên đổi model mà nội dung giữ nguyên chưa tự tạo lại embedding.

### Điểm cần hoàn thiện

- **Lỗi dependency indexing:** `get_ai_indexing_service()` trong `app/api/v1/ai/deps.py` truyền `embedding_service=...`, trong khi constructor nhận `ai_embedding_service`. Endpoint index chưa thể chạy thành công trước khi sửa chỗ này. Sau khi sửa, cần có dữ liệu sách và index trước khi thử semantic search.
- Chưa tự đồng bộ vector khi catalog thay đổi, chưa ghi `ai_search_logs`, chưa có test AI. Migration chưa tạo index HNSW/IVFFlat; recommendation tải toàn bộ embedding vào RAM để tính điểm.

## Kiểm thử và bảo trì

Chạy từ `backend` sau khi cài dependency và cấu hình môi trường:

```bash
uv run python -m unittest discover -s tests -v
uv run ruff check .
uv run python -m app.scripts.cleanup_refresh_tokens
```

Có 8 unit test trong `tests/test_borrowing_service.py`: commit/rollback, giữ tồn kho khi duyệt, tránh trừ kho hai lần, hoàn kho khi trả/hủy/hết hạn và chặn gia hạn khi người khác đang chờ. Test dùng mock/repository giả, không xác nhận khóa đồng thời trên PostgreSQL thực tế.

Cleanup xóa refresh token hết hạn hoặc bị thu hồi; cần cron/scheduler bên ngoài để chạy định kỳ. `/heathz` chỉ trả trạng thái ứng dụng, không kiểm tra DB hay model AI.
