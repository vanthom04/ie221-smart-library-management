# ⚙️ Backend — Smart Library Management

API server cho hệ thống Quản Lý Thư Viện & Mượn Trả Sách Thông Minh, được xây dựng với **FastAPI**, **SQLAlchemy (Async)**, và **PostgreSQL**.

## 🚀 Công nghệ sử dụng

| Công nghệ                                              | Phiên bản | Mục đích                      |
| :----------------------------------------------------- | :-------: | :---------------------------- |
| [Python](https://www.python.org/)                      |   3.12    | Ngôn ngữ chính                |
| [FastAPI](https://fastapi.tiangolo.com/)               |   0.14x   | Web framework (async)         |
| [SQLAlchemy](https://www.sqlalchemy.org/)              |   2.0.x   | ORM (hỗ trợ async)            |
| [PostgreSQL](https://www.postgresql.org/)              |     —     | Cơ sở dữ liệu                 |
| [asyncpg](https://github.com/MagicStack/asyncpg)       |  0.31.x   | PostgreSQL async driver       |
| [Alembic](https://alembic.sqlalchemy.org/)             |  1.19.x   | Database migrations           |
| [PyJWT](https://pyjwt.readthedocs.io/)                 |  2.13.x   | JSON Web Token (xác thực)     |
| [pwdlib](https://github.com/frankie567/pwdlib)         |   0.3.x   | Mã hóa mật khẩu (Argon2)      |
| [Pydantic Settings](https://docs.pydantic.dev/latest/) |     —     | Quản lý biến môi trường       |
| [Scalar](https://scalar.com/)                          |   1.8.x   | API Documentation UI          |
| [uv](https://docs.astral.sh/uv/)                       |     —     | Package & environment manager |

## 📂 Cấu trúc thư mục

```text
backend/
├── app/                        # Code chính của ứng dụng
│   ├── api/                    # API routers (endpoint definitions)
│   │   ├── v1/                 # API v1 endpoints
│   │   │   └── router.py       # Main API v1 router
│   │   ├── deps.py             # Common API dependencies
│   │   └── __init__.py
│   ├── core/                   # Cấu hình chung
│   │   ├── config.py           # Settings (đọc từ .env qua Pydantic)
│   │   └── __init__.py
│   ├── db/                     # Kết nối & cấu hình database
│   │   ├── base.py             # Declarative Base với Naming Convention
│   │   ├── session.py          # Async Engine, SessionLocal & get_db dependency
│   │   └── __init__.py
│   ├── models/                 # SQLAlchemy ORM models (table definitions)
│   │   └── __init__.py
│   ├── repositories/           # Lớp truy vấn CSDL (CRUD operations)
│   │   └── __init__.py
│   ├── schemas/                # Pydantic schemas (request/response validation)
│   │   └── __init__.py
│   ├── services/               # Business logic layer
│   │   └── __init__.py
│   ├── __init__.py
│   └── main.py                 # FastAPI app entry point (CORS, Scalar docs)
├── alembic/                    # Database migration scripts
│   ├── versions/               # Auto-generated migration files
│   ├── env.py                  # Alembic environment config (kết nối target_metadata = Base.metadata)
│   └── script.py.mako          # Migration template
├── alembic.ini                 # Alembic configuration
├── pyproject.toml              # Project metadata & dependencies (uv)
├── uv.lock                     # Lock file (dependencies cố định)
├── .python-version             # Python version (3.12)
├── .env                        # (Không commit) Biến môi trường
├── .env.example                # Biến môi trường mẫu
└── .gitignore                  # Cấu hình Git ignore
```

## 🛠️ Hướng dẫn cài đặt

### Yêu cầu

- **Python** >= 3.12
- **uv** — Công cụ quản lý package Python ([Hướng dẫn cài đặt](https://docs.astral.sh/uv/getting-started/installation/))
- **PostgreSQL** — Database server

### Cài đặt và chạy

```bash
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt dependencies (uv tự tạo .venv)
uv sync

# 3. Kích hoạt virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate
# Git Bash:
source .venv/Scripts/activate

# 4. Tạo file biến môi trường
cp .env.example .env

# 5. Cấu hình biến môi trường trong file .env
#    (xem phần "Biến môi trường" bên dưới)

# 6. Chạy database migration
alembic upgrade head

# 7. Khởi chạy dev server
uv run fastapi dev
```

API server sẽ chạy tại: **<http://localhost:8000>**

API Documentation (Scalar UI) tại: **<http://localhost:8000/docs>**

## ⚙️ Biến môi trường

Tạo file `.env` từ `.env.example` và cấu hình các giá trị sau:

### App

| Biến                   | Mô tả                           | Giá trị mặc định                         |
| :--------------------- | :------------------------------ | :--------------------------------------- |
| `PROJECT_NAME`         | Tên project hiển thị            | `Smart Library Management Backend`       |
| `API_V1_PREFIX`        | Prefix cho API v1               | `/api/v1`                                |
| `ENVIRONMENT`          | Môi trường chạy                 | `local` (`local`/`staging`/`production`) |
| `BACKEND_CORS_ORIGINS` | Danh sách origin được phép CORS | `["http://localhost:5173"]`              |

### Security

| Biến                          | Mô tả                                                 | Giá trị mặc định |
| :---------------------------- | :---------------------------------------------------- | :--------------- |
| `SECRET_KEY`                  | Khóa bí mật cho JWT (tạo bằng `openssl rand -hex 32`) | —                |
| `ALGORITHM`                   | Thuật toán JWT                                        | `HS256`          |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Thời gian hết hạn access token (phút)                 | `30`             |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | Thời gian hết hạn refresh token (ngày)                | `7`              |
| `COOKIE_SECURE`               | Bật secure cookie (bắt buộc `true` khi deploy HTTPS)  | `false`          |

### Database

| Biến           | Mô tả                            | Ví dụ                                                          |
| :------------- | :------------------------------- | :------------------------------------------------------------- |
| `DATABASE_URL` | Connection string đến PostgreSQL | `postgresql+asyncpg://user:password@localhost:5432/library_db` |

## 🗃️ Database & Migration

### SQLAlchemy & Session Management

- **`app/db/base.py`**: Định nghĩa `Base` class sử dụng `DeclarativeBase` với Naming Convention chuẩn (`pk`, `fk`, `uq`, `ix`, `ck`).
- **`app/db/session.py`**: Khởi tạo `create_async_engine` kết nối PostgreSQL với `AsyncSessionLocal`. Cung cấp `get_db()` dependency tự động quản lý đóng/mở session theo từng HTTP request.
- **`alembic/env.py`**: Đã kết nối `target_metadata = Base.metadata` và import các models từ `app.models` để tự động phát hiện thay đổi schema khi migrate.

### Thao tác Migration (Alembic)

```bash
# Tạo migration mới sau khi thay đổi models
alembic revision --autogenerate -m "mô tả thay đổi"

# Chạy migration (cập nhật database)
alembic upgrade head

# Rollback migration gần nhất
alembic downgrade -1

# Xem lịch sử migration
alembic history
```

## 🏗️ Kiến trúc

Project sử dụng kiến trúc **Layered Architecture** (phân tầng):

```text
Request → CORS Middleware → API Router (v1) → Service → Repository → Database
                                              ↕
                                           Schema (Pydantic)
```

| Layer          | Thư mục             | Trách nhiệm                                                        |
| :------------- | :------------------ | :----------------------------------------------------------------- |
| **API**        | `app/api/`          | Định nghĩa v1 router, endpoints, nhận request, trả response        |
| **Service**    | `app/services/`     | Xử lý logic nghiệp vụ, validation phức tạp                         |
| **Repository** | `app/repositories/` | Truy vấn CSDL (CRUD), tách biệt data access                        |
| **Schema**     | `app/schemas/`      | Validate dữ liệu vào/ra (Pydantic models)                          |
| **Model**      | `app/models/`       | Định nghĩa bảng CSDL (SQLAlchemy ORM)                              |
| **Core**       | `app/core/`         | Cấu hình chung (`config.py`), security, JWT                        |
| **DB**         | `app/db/`           | `Base` class (Naming convention), Async Session engine, `get_db()` |

## 🔒 Xác thực & Middleware

- **CORS Middleware**: Cấu hình tự động theo `BACKEND_CORS_ORIGINS` trong `.env`.
- **Access Token**: JWT trong header `Authorization: Bearer <token>`
- **Refresh Token**: HTTP-only cookie
- **Mã hóa mật khẩu**: Argon2 (qua `pwdlib`)

## 📡 API Endpoints

| Method | Endpoint  | Mô tả                         |
| :----- | :-------- | :---------------------------- |
| GET    | `/`       | Hello World                   |
| GET    | `/heathz` | Health check                  |
| GET    | `/docs`   | API Documentation (Scalar UI) |

> Các endpoint nghiệp vụ sẽ được thêm vào `app/api/v1/` theo tiến độ phát triển.
