# 📚 Hệ Thống Quản Lý Thư Viện & Mượn Trả Sách Thông Minh (Smart Library Management)

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.141+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Đồ án kết thúc môn: Kỹ thuật lập trình Python (IE221)**  
_Lớp: IE221.F33.LT.CNTT — Trường Đại học Công nghệ Thông tin, ĐHQG-HCM (UIT)_  
\*Giảng viên hướng dẫn: **ThS. Nghi Hoàng Khoa\***

</div>

---

## 📖 Giới thiệu đồ án

**Smart Library Management** là hệ thống quản lý thư viện và mượn trả sách toàn diện theo mô hình **Client-Server**, phục vụ cả hai đối tượng bạn đọc và quản trị viên thư viện. Hệ thống tối ưu hóa toàn bộ vòng đời mượn trả thông qua luồng xử lý giao dịch nguyên tử (ACID transaction), đồng thời tích hợp trí tuệ nhân tạo (AI) chạy on-premise với **Sentence Transformers** và **pgvector** để hỗ trợ **tìm kiếm ngữ nghĩa (Semantic Search)** và **hệ thống gợi ý sách cá nhân hóa (Personalized Recommendation)**.

---

## 👥 Danh sách thành viên & Phân công (Nhóm 11)

| STT | Họ và tên           |   MSSV   | Vai trò chính        | Chi tiết phân công công việc                                                                                | Đóng góp |
| :-: | :------------------ | :------: | :------------------- | :---------------------------------------------------------------------------------------------------------- | :------: |
|  1  | **Trần Ngọc Tâm**   | 25410300 | Book Catalog         | Quản lý sách, tác giả, thể loại, nhà xuất bản; CRUD và tích hợp giao diện catalog, thuyết trình             |   100%   |
|  2  | **Hồ Thiên Phúc**   | 25410284 | Dashboard Admin/User | API & UI Dashboard bạn đọc/admin, thống kê trực quan, thiết kế slide, quay video demo                       |   100%   |
|  3  | **Chu Văn Thơm**    | 25410314 | IAM & Infrastructure | Xác thực, phân quyền (RBAC), Refresh Token Rotation, setup môi trường, tích hợp hệ thống, tổng hợp báo cáo  |   100%   |
|  4  | **Trần Bình Trọng** | 25410324 | Borrowing Core       | Đặt trước, duyệt, mượn, trả, gia hạn, kiểm soát tồn kho nguyên tử (`SELECT ... FOR UPDATE`)                 |   100%   |
|  5  | **Lê Thanh Quốc**   | 25410289 | AI & Recommendation  | Model embedding đa ngôn ngữ, semantic search vector (pgvector), recommendation thuật toán Cosine & Fallback |   100%   |

> [!NOTE]
> Bảng kê khai chi tiết các công cụ AI (ChatGPT, Claude, Gemini) hỗ trợ trong quá trình phát triển xem tại: [`docs/KhaiBaoAI.md`](docs/KhaiBaoAI.md).

---

## 🌟 Chức năng hệ thống

### 1. Dành cho Bạn đọc (Reader / Member)

- **Xác thực & Tài khoản:** Đăng ký, đăng nhập nhận JWT Access Token và Refresh Token bảo mật qua HTTP-only cookie, tự động làm mới phiên (token rotation), đổi mật khẩu, xem hồ sơ cá nhân.
- **Tra cứu Catalog:** Danh sách sách đa dạng, lọc theo thể loại, tác giả, nhà xuất bản, tìm kiếm nhanh theo tiêu đề (PostgreSQL Trigram index).
- **Tìm kiếm ngữ nghĩa (AI Semantic Search):** Tìm kiếm sách thông minh dựa trên ý niệm/nội dung mô tả thay vì chỉ khớp từ khóa chính xác.
- **Mượn trả & Đặt trước:**
  - Đặt giữ chỗ sách trực tuyến, theo dõi trạng thái phiếu đặt (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`).
  - Hủy yêu cầu đặt trước khi còn hiệu lực.
  - Theo dõi lịch sử mượn trả chi tiết, ngày mượn, hạn trả, trạng thái quá hạn.
  - Gia hạn mượn sách trực tuyến (tự động kiểm tra điều kiện: chưa quá hạn, trong số lần cho phép, không có bạn đọc khác đang đợi).
- **Dashboard cá nhân:** Thống kê nhanh số sách đang mượn, sách sắp đến hạn (trong vòng 3 ngày), hoạt động mượn trả gần đây theo dòng thời gian, và danh sách sách gợi ý AI cá nhân hóa.

### 2. Dành cho Quản trị viên (Admin / Librarian)

- **Quản lý Danh mục (Catalog Management):** CRUD toàn diện Sách, Tác giả, Thể loại, Nhà xuất bản; liên kết nhiều-nhiều Sách - Tác giả; kiểm soát tồn kho (`total_copies`, `available_copies`).
- **Nghiệp vụ Mượn - Trả (Borrowing Operations):**
  - Quản lý danh sách phiếu đặt trước: Duyệt cấp giữ chỗ (tự động giữ tồn kho) hoặc từ chối kèm lý do.
  - Lập phiếu mượn trực tiếp tại quầy hoặc chuyển đổi trực tiếp từ phiếu đặt trước đã duyệt.
  - Xác nhận trả sách, hoàn trả tồn kho tức thời.
  - Giải phóng hàng loạt phiếu đặt trước quá hạn lấy sách (`expire reservations`).
- **Dashboard & Báo cáo Thống kê:**
  - Thống kê thời gian thực: Tổng đầu sách, tổng bản sao, số sách đang mượn, số độc giả đăng ký.
  - Biểu đồ xu hướng mượn sách linh hoạt theo tuần, tháng hoặc năm (Recharts).
  - Biểu đồ cơ cấu phân bố sách theo thể loại.
  - Bảng theo dõi các giao dịch mượn trả mới nhất.
- **Quản trị người dùng & AI Indexing:**
  - Khóa (`LOCKED`) / mở khóa (`ACTIVE`) tài khoản người dùng, lập tức thu hồi toàn bộ phiên đăng nhập khi khóa.
  - Kích hoạt lập chỉ mục vector (AI Indexing) cho từng sách hoặc toàn bộ kho sách.

---

## 🏛️ Kiến trúc hệ thống

Dự án được thiết kế theo mô hình **Client-Server tách biệt** với phân tầng rõ ràng (Separation of Concerns):

```mermaid
graph TD
    subgraph Client["Frontend SPA (React 19 + TypeScript + Vite)"]
        UI["UI Components (Shadcn + Tailwind CSS v4)"]
        Router["React Router v8 (Middleware: Guest/Auth/Admin)"]
        Zustand["Zustand (Auth Session State)"]
        TQ["TanStack Query v5 (Server State & Cache)"]
        Axios["Axios Client (HTTP-only Cookie & Token Refresh Queue)"]
    end

    subgraph Server["Backend API (FastAPI - Python 3.12)"]
        API["FastAPI Routers (/api/v1)"]
        AuthMid["Security & Dependency Injection (JWT, Argon2, RBAC)"]
        Service["Service Layer (Business Logic & Transactions)"]
        Repo["Repository Layer (Data Access & Eager Loading)"]
        ORM["SQLAlchemy 2.0 AsyncSession"]
    end

    subgraph DataAI["Data & AI Layer"]
        PG[("PostgreSQL 16")]
        Trgm["pg_trgm (GIN Trigram Index)"]
        PGV["pgvector (Vector Embeddings 384d)"]
        ST["Sentence Transformers (MiniLM-L12-v2 On-Premise)"]
    end

    UI --> Router
    Router --> TQ
    TQ --> Axios
    Zustand -.-> Axios
    Axios -- "HTTP REST + Bearer Token" --> API
    API --> AuthMid
    AuthMid --> Service
    Service --> Repo
    Service -.-> ST
    Repo --> ORM
    ORM --> PG
    PG --- Trgm
    PG --- PGV
```

### Điểm nhấn kỹ thuật backend:

1. **Kiến trúc phân tầng (Layered Architecture):** `Router` ➔ `Service` ➔ `Repository` ➔ `Model/Schema`. Logic nghiệp vụ hoàn toàn độc lập với web framework.
2. **Kiểm soát đồng thời & Giao dịch ACID:** Mọi thao tác thay đổi số lượng sách sẵn có (`available_copies`) khi đặt trước, mượn, trả hoặc hủy đều thực hiện trong một Database Transaction duy nhất và được bảo vệ bằng khóa bi quan `SELECT ... FOR UPDATE` nhằm triệt tiêu hiện tượng Race Condition / âm tồn kho.
3. **Bảo mật phiên toàn diện:**
   - Mật khẩu mã hóa chuẩn công nghiệp **Argon2** (`pwdlib`).
   - Ngắn hạn: **JWT Access Token** (30 phút).
   - Dài hạn: **Refresh Token** ngẫu nhiên 32-bytes đặt trong HTTP-only Cookie (`SameSite=Lax`, `Secure`), lưu bản băm SHA-256 trong CSDL để xoay vòng token (**Token Rotation**) và phòng chống tấn công XSS/CSRF.
4. **AI Vector On-Premise:** Sử dụng model mã nguồn mở `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` nhúng văn bản thành vector chuẩn hóa 384 chiều, tìm kiếm khoảng cách Cosine trực tiếp trong PostgreSQL qua extension `pgvector`. Thuật toán gợi ý tính toán trọng tâm vector sở thích từ lịch sử mượn và có cơ chế fallback theo độ phổ biến cho độc giả mới.

---

## 💻 Công nghệ sử dụng

### Backend

| Công nghệ                 |  Phiên bản  | Vai trò                                              |
| :------------------------ | :---------: | :--------------------------------------------------- |
| **Python**                |  `>= 3.12`  | Ngôn ngữ phát triển backend chính                    |
| **FastAPI**               | `>= 0.141`  | Web framework bất đồng bộ (async), hiệu năng cao     |
| **SQLAlchemy**            | `>= 2.0.52` | ORM bất đồng bộ với AsyncEngine & AsyncSession       |
| **asyncpg**               |  `>= 0.31`  | Driver kết nối PostgreSQL bất đồng bộ                |
| **PostgreSQL**            |   `>= 15`   | Hệ quản trị cơ sở dữ liệu quan hệ                    |
| **pgvector**              |  `>= 0.5`   | Extension lưu trữ và truy vấn vector tương đồng      |
| **pg_trgm**               |  Tích hợp   | Extension tối ưu hóa tìm kiếm văn bản với GIN index  |
| **Alembic**               |  `>= 1.19`  | Quản lý database schema migrations                   |
| **Sentence Transformers** |  `>= 6.0`   | Tạo text embeddings đa ngôn ngữ (384 chiều)          |
| **NumPy**                 |  `>= 2.5`   | Tính toán ma trận vector và độ tương đồng Cosine     |
| **pwdlib (Argon2)**       |  `>= 0.3`   | Băm và xác thực mật khẩu an toàn                     |
| **PyJWT**                 |  `>= 2.13`  | Cấp phát và xác thực JSON Web Token                  |
| **Scalar FastAPI**        |  `>= 1.8`   | Giao diện tài liệu API hiện đại, tương tác trực tiếp |
| **uv**                    |  Mới nhất   | Quản lý gói và môi trường ảo siêu tốc viết bằng Rust |
| **Ruff**                  |  `>= 0.16`  | Linter và code formatter chuẩn Python                |

### Frontend

| Công nghệ                 |   Phiên bản    | Vai trò                                                   |
| :------------------------ | :------------: | :-------------------------------------------------------- |
| **React**                 |     `19.2`     | Thư viện UI hiện đại                                      |
| **TypeScript**            |    `~ 6.0`     | Ngôn ngữ tĩnh an toàn kiểu dữ liệu (Strict Mode)          |
| **Vite**                  |     `8.2`      | Build tool và dev server với HMR tức thì                  |
| **React Compiler**        |     `1.0`      | Tối ưu hóa render tự động bằng Babel plugin               |
| **React Router**          |     `8.3`      | Routing phân cấp, Data Router và middleware phân quyền    |
| **TanStack Query**        |    `5.101`     | Quản lý server state, cache dữ liệu và mutation           |
| **Zustand**               |     `5.0`      | Quản lý client state (phiên xác thực người dùng)          |
| **Tailwind CSS**          |     `4.3`      | Framework utility-first CSS v4 thế hệ mới                 |
| **Shadcn UI & Base UI**   |    Mới nhất    | Hệ thống component UI thẩm mỹ và chuẩn trợ năng           |
| **React Hook Form & Zod** | `7.85` / `4.4` | Quản lý và xác thực dữ liệu biểu mẫu chặt chẽ             |
| **Recharts**              |     `3.8`      | Vẽ biểu đồ thống kê xu hướng và danh mục                  |
| **Motion**                |     `13.1`     | Hiệu ứng chuyển động mượt mà                              |
| **Axios**                 |     `1.19`     | HTTP Client xử lý credentials và auto refresh token queue |

---

## 📂 Cấu trúc dự án

```text
ie221-smart-library-management/
├── .github/                      # Cấu hình GitHub Actions CI/CD
├── backend/                      # Phân hệ Backend API (FastAPI)
│   ├── alembic/                  # Kịch bản database migrations
│   │   └── versions/             # Lịch sử các bản migration schema & extensions
│   ├── app/
│   │   ├── api/                  # FastAPI routers, endpoints & dependencies
│   │   │   ├── deps.py           # Dependency injection (Auth, DB, RBAC)
│   │   │   └── v1/               # API endpoints phiên bản 1 (Auth, Users, Catalog, Borrowing, AI, Dashboard)
│   │   ├── core/                 # Cấu hình hệ thống (Settings, Security, Exceptions, OpenAPI)
│   │   ├── db/                   # Cấu hình AsyncSession, Base model và mixins
│   │   ├── models/               # 13 bảng thực thể ORM SQLAlchemy 2.0
│   │   ├── repositories/         # Tầng truy xuất dữ liệu (Data Access Layer)
│   │   ├── schemas/              # Pydantic v2 schemas cho request/response validation
│   │   ├── services/             # Tầng nghiệp vụ xử lý logic (Business Logic Layer)
│   │   ├── scripts/              # Script seed dữ liệu, AI indexing và dọn dẹp token
│   │   └── main.py               # Điểm khởi chạy ứng dụng FastAPI
│   ├── tests/                    # 19 unit tests nghiệp vụ và script kiểm tra DB thực tế
│   ├── .env.example              # Mẫu biến môi trường backend
│   ├── pyproject.toml            # Cấu hình dependencies (uv) và linter (ruff)
│   └── README.md                 # Tài liệu kỹ thuật chi tiết của backend
├── frontend/                     # Phân hệ Frontend SPA (React 19 + Vite)
│   ├── public/                   # Tài nguyên tĩnh (Favicon, Logo, Mock images)
│   ├── src/
│   │   ├── components/           # Component dùng chung và UI primitives (Shadcn/Base UI)
│   │   ├── features/             # Mã nguồn tổ chức theo từng cụm tính năng (Feature-based)
│   │   │   ├── admin-borrowing/  # Quản lý mượn trả & đặt trước phía admin
│   │   │   ├── admin-dashboard/  # Biểu đồ và chỉ số phân tích dành cho admin
│   │   │   ├── auth/             # Form đăng ký, đăng nhập và store phiên
│   │   │   ├── borrowing/        # Nghiệp vụ đặt trước và gia hạn của bạn đọc
│   │   │   ├── home/             # Các khối hiển thị trang chủ
│   │   │   ├── profile/          # Thông tin cá nhân và bảo mật
│   │   │   ├── search/           # Bộ lọc catalog và tìm kiếm ngữ nghĩa AI
│   │   │   └── user-dashboard/   # Dashboard và danh sách gợi ý của bạn đọc
│   │   ├── layouts/              # MainLayout, AdminLayout
│   │   ├── lib/                  # Cấu hình Axios, React Query, ApiError, Utils
│   │   ├── pages/                # Các trang view ứng với route
│   │   ├── router/               # Khai báo routes và middleware phân quyền
│   │   ├── App.tsx               # Root component
│   │   └── main.tsx              # Điểm gắn kết DOM của React 19
│   ├── .env.example              # Mẫu biến môi trường frontend
│   ├── package.json              # Khai báo dependencies frontend
│   └── README.md                 # Tài liệu kỹ thuật chi tiết của frontend
├── docs/                         # Hồ sơ tài liệu đồ án chính thức
│   ├── BaoCao_Final.pdf          # Báo cáo toàn văn đồ án kết thúc môn (PDF)
│   ├── BaoCao_Final.docx         # Báo cáo toàn văn đồ án kết thúc môn (Word)
│   ├── Slide_Final.pdf           # Slide thuyết trình báo cáo đồ án
│   ├── Demo_Video.mp4            # Video quay trực quan kịch bản demo hệ thống
│   └── KhaiBaoAI.md              # Bảng kê khai minh bạch việc sử dụng công cụ AI
├── package.json                  # Cấu hình script chạy đồng thời monorepo
└── README.md                     # Tài liệu tổng quan dự án
```

---

## 🛠️ Hướng dẫn cài đặt và vận hành

### 1. Yêu cầu hệ thống (Prerequisites)

- **Python**: `>= 3.12`
- **Node.js**: `>= 22`
- **Trình quản lý gói**: `uv` (cho Python) và `pnpm` hoặc `npm` (cho Node.js)
- **PostgreSQL**: Đã cài đặt và khởi chạy, tài khoản có quyền kích hoạt các extension `pg_trgm` và `vector`.

---

### 2. Thiết lập Biến môi trường

Sao chép file cấu hình mẫu cho cả hai phân hệ:

```bash
# Trên Linux / macOS
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Trên Windows PowerShell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
```

#### Cấu hình tối thiểu tại `backend/.env`:

```env
PROJECT_NAME="Smart Library Management Backend"
ENVIRONMENT="local"
DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/library_db"
SECRET_KEY="your-super-secret-key-min-32-chars-long"
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
COOKIE_SECURE=false
```

#### Cấu hình tại `frontend/.env`:

```env
VITE_API_URL="http://localhost:8000/api/v1"
```

---

### 3. Cài đặt Dependencies & Migration CSDL

Từ thư mục gốc của dự án:

```bash
# 1. Cài đặt dependencies cho backend (thông qua uv)
cd backend
uv sync

# 2. Áp dụng toàn bộ Database Migrations lên PostgreSQL
uv run alembic upgrade head
cd ..

# 3. Cài đặt dependencies cho frontend (bằng pnpm hoặc npm)
cd frontend
pnpm install   # hoặc: npm install
cd ..
```

---

### 4. Khởi tạo Dữ liệu mẫu (Demo Seed Data)

Dự án cung cấp bộ kịch bản khởi tạo sẵn danh mục sách phong phú, các tác giả, thể loại, nhà xuất bản, tài khoản mẫu và lịch sử giao dịch:

```bash
cd backend
# Tạo dữ liệu demo và tự động tải model AI để lập chỉ mục embedding:
uv run python -m app.scripts.seed_demo

# (Tùy chọn) Nếu mạng chậm hoặc muốn bỏ qua tải model lúc đầu:
# uv run python -m app.scripts.seed_demo --skip-ai
# Sau đó có thể lập chỉ mục AI bất kỳ lúc nào:
# uv run python -m app.scripts.index_demo_ai
cd ..
```

#### Tài khoản thử nghiệm mặc định:

| Vai trò                   | Email đăng nhập            | Mật khẩu mặc định |
| :------------------------ | :------------------------- | :---------------- |
| **Quản trị viên (Admin)** | `demo.admin@example.com`   | `Demo123!@#`      |
| **Bạn đọc (User 1)**      | `demo.minhanh@example.com` | `Demo123!@#`      |
| **Bạn đọc (User 2)**      | `demo.giahuy@example.com`  | `Demo123!@#`      |

---

### 5. Khởi chạy ứng dụng

#### Cách 1: Khởi chạy đồng thời cả Backend & Frontend từ thư mục gốc

Tại thư mục gốc dự án:

```bash
npm install   # Cài concurrently nếu chạy lần đầu
npm run dev   # Khởi chạy song song cả hai server
```

#### Cách 2: Khởi chạy thủ công từng phân hệ

- **Terminal 1 — Backend API:**

  ```bash
  cd backend
  uv run fastapi dev
  ```

  _Server lắng nghe tại:_ `http://localhost:8000`

- **Terminal 2 — Frontend Client:**
  ```bash
  cd frontend
  pnpm run dev   # hoặc: npm run dev
  ```
  _Ứng dụng client truy cập tại:_ `http://localhost:5173`

---

### 6. Cổng dịch vụ & Liên kết tra cứu

| Dịch vụ                             | Đường dẫn truy cập                          | Ghi chú                                |
| :---------------------------------- | :------------------------------------------ | :------------------------------------- |
| **Giao diện người dùng (Frontend)** | `http://localhost:5173`                     | Giao diện bạn đọc và cổng admin        |
| **Backend API Server**              | `http://localhost:8000`                     | Cổng dịch vụ REST API                  |
| **Scalar API Documentation**        | `http://localhost:8000/docs`                | Giao diện tra cứu & test API trực quan |
| **OpenAPI Schema (JSON)**           | `http://localhost:8000/api/v1/openapi.json` | Đặc tả kỹ thuật OpenAPI v3             |
| **Health Check Endpoint**           | `http://localhost:8000/heathz`              | Kiểm tra trạng thái máy chủ            |

---

## 🧪 Kiểm thử & Đảm bảo chất lượng (Quality Assurance)

### Phân hệ Backend:

Bộ 19 kịch bản kiểm thử tự động bao phủ trọn vẹn các luồng trọng yếu: giao dịch đặt/mượn/trả sách, kiểm soát tồn kho, logic khóa tài khoản, phân quyền danh mục, thuật toán gợi ý AI và các chỉ số dashboard.

```bash
cd backend

# Chạy toàn bộ 19 unit tests (100% Passed)
uv run python -m unittest discover -s tests -v

# Kiểm tra quy chuẩn mã nguồn bằng Ruff Linter
uv run ruff check .

# (Tùy chọn) Kiểm tra kết nối và tính toàn vẹn với CSDL thật:
# uv run python -m tests.manual_borrowing_db_check
# uv run python -m tests.manual_ai_db_check
```

### Phân hệ Frontend:

```bash
cd frontend

# Kiểm tra cú pháp và quy tắc mã nguồn bằng ESLint 10
pnpm run lint   # hoặc: npm run lint

# Kiểm tra an toàn kiểu dữ liệu (Type check) và Build production
pnpm run build  # hoặc: npm run build
```

---

## 📑 Tài liệu tham khảo & Báo cáo đồ án

Tất cả hồ sơ báo cáo chính thức của đồ án được lưu trữ đầy đủ trong thư mục [`docs/`](docs/):

- 📄 **Báo cáo đồ án hoàn chỉnh:** [`docs/BaoCao_Final.pdf`](docs/BaoCao_Final.pdf) (hoặc file Word [`docs/BaoCao_Final.docx`](docs/BaoCao_Final.docx))
- 📊 **Slide thuyết trình:** [`docs/Slide_Final.pdf`](docs/Slide_Final.pdf)
- 🎥 **Video demo hệ thống:** [`docs/Demo_Video.mp4`](docs/Demo_Video.mp4)
- 🤖 **Bảng kê khai sử dụng AI:** [`docs/KhaiBaoAI.md`](docs/KhaiBaoAI.md)
- ⚙️ **Tài liệu chi tiết Backend:** [`backend/README.md`](backend/README.md)
- 🖥️ **Tài liệu chi tiết Frontend:** [`frontend/README.md`](frontend/README.md)

---

_🚀 Happy Coding..._
