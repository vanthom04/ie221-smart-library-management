# 📚 Hệ Thống Quản Lý Thư Viện & Mượn Trả Sách Thông Minh

Đây là kho lưu trữ mã nguồn (repository) cho đồ án kết thúc môn: **Kỹ thuật lập trình Python (IE221)**. Dự án được phát triển theo mô hình Client-Server với giao diện người dùng hiện đại và hệ thống xử lý backend hiệu năng cao, tích hợp AI để tối ưu hóa trải nghiệm mượn trả sách.

## 👥 Danh sách thành viên (Nhóm 11)

| STT | Tên thành viên  |   MSSV   | Phân công      |
| :-: | :-------------- | :------: | :------------- |
|  1  | Trần Ngọc Tâm   | 25410300 | Book Catalog   |
|  2  | Hồ Thiên Phúc   | 25410284 | Dashboard & QA |
|  3  | Chu Văn Thơm    | 25410314 | IAM & Infra    |
|  4  | Trần Bình Trọng | 25410324 | Borrowing Core |
|  5  | Lê Thanh Quốc   | 25410289 | Fines & AI     |

## 🚀 Công nghệ sử dụng

- **Backend:** Python 3, FastAPI. Quản lý môi trường và package bằng `uv`.
- **Frontend:** ReactJS (khởi tạo qua Vite), JavaScript/TypeScript.
- **Cơ sở dữ liệu:** PostgreSQL (kết hợp SQLAlchemy ORM).
- **Tích hợp AI:** Sử dụng API của [Groq] để hỗ trợ gợi ý sách thông minh.

## 📂 Cấu trúc thư mục (Monorepo)

Dự án được chia thành 2 phân hệ chính nằm trong cùng một repository để dễ dàng quản lý cho làm việc nhóm:

```text
ie221-smart-library-management/
├─ .github/                      # Cấu hình GitHub Actions CI/CD workflows
├─ .vscode/                      # Cấu hình workspace & extension gợi ý cho VS Code
├─ backend/                      # Nơi chứa mã nguồn FastAPI (Python)
│  ├─ alembic/                   # Thư mục chứa các kịch bản migration tự động sinh ra
│  ├─ app/                       # Code chính của ứng dụng
│  │  ├─ api/                    # Các router định tuyến API (users.py, books.py, ...)
│  │  ├─ core/                   # Cấu hình chung (config, security, JWT)
│  │  ├─ db/                     # Kết nối CSDL và các file migration (Alembic)
│  │  ├─ models/                 # Khai báo các table trong Database (SQLAlchemy)
│  │  ├─ repositories/           # Lớp truy vấn CSDL (CRUD, SELECT, INSERT...) tách biệt với Service
│  │  ├─ schemas/                # Pydantic models (validate data in/out)
│  │  ├─ services/               # Chứa logic xử lý nghiệp vụ và gọi API AI
│  │  └─ main.py                 # File chạy chính của FastAPI
│  ├─ pyproject.toml             # Quản lý thư viện Python bởi `uv`
│  └─ .env                       # (Không commit) Các biến môi trường backend
│
├─ frontend/                     # Nơi chứa mã nguồn ReactJS (Vite)
│  ├─ src/                       # Code chính của giao diện
│  │  ├─ components/             # Các component dùng chung (Button, Modal, Navbar...)
│  │  ├─ features/               # Mô-đun theo tính năng (Feature-driven)
│  │  ├─ hooks/                  # Custom React Hooks
│  │  ├─ layouts/                # App Layouts
│  │  ├─ lib/                    # Utilities & Config Layer
│  │  ├─ pages/                  # Các trang chính (Home, Login, Dashboard, Search)
│  │  ├─ router/                 # Route definitions & Middleware
│  │  └─ main.tsx                # Entry point của React
│  ├─ package.json               # Quản lý thư viện Node.js
│  └─ .env                       # (Không commit) Cấu hình URL gọi API
│
├─ docs/                         # Tài liệu của đồ án (Bắt buộc)
│  ├─ BaoCao_Final.pdf           # Báo cáo chi tiết nghiệp vụ và hệ thống
│  ├─ Slide_Final.pdf            # Slide thuyết trình (Tối đa 10-12 trang)
│  └─ KhaiBaoAI.md               # Bảng kê khai chi tiết các prompt AI đã dùng
│
├─ package.json                  # Scripts quản lý và khởi chạy toàn bộ monorepo
├─ README.md                     # Hướng dẫn dự án
└─ .gitignore                    # Bỏ qua các file không cần thiết khi commit
```

## 🛠 Hướng dẫn cài đặt và chạy dự án

### 1. Yêu cầu hệ thống (Prerequisites)

- **Python:** >= 3.10
- **uv:** Công cụ quản lý package Python cực nhanh (Cài đặt: `curl -LsSf https://astral.sh/uv/install.sh | sh` hoặc `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`)
- **Node.js:** >= 20.x
- **Git**

---

### 2. Khởi chạy nhanh toàn bộ dự án (Khuyến nghị)

Tại thư mục gốc của repository:

```bash
# 1. Cài đặt các công cụ chạy song song ở root
npm install

# 2. Tự động cài đặt dependencies cho cả Backend & Frontend
npm run install:all

# 3. Khởi chạy đồng thời cả Backend (FastAPI) và Frontend (ReactJS)
npm run dev
```

- **Frontend:** `http://localhost:5173`
- **Backend API Docs (Scalar UI / Swagger):** `http://localhost:8000/docs`

---

### 3. Khởi chạy thủ công từng phân hệ (Manual)

#### A. Khởi chạy Backend (FastAPI)

Mở terminal và di chuyển vào thư mục `backend`:

```bash
cd backend

# Cài đặt thư viện bằng uv
uv sync

# Khởi chạy server ở chế độ dev
uv run fastapi dev
```

#### B. Khởi chạy Frontend (ReactJS)

Mở một terminal mới và di chuyển vào thư mục `frontend`:

```bash
cd frontend

# Cài đặt thư viện
npm install

# Khởi chạy giao diện
npm run dev
```

Giao diện sẽ chạy tại: `http://localhost:5173`

## 🤝 Quy trình làm việc nhóm trên Git (Bắt buộc tuân thủ)

Để có lịch sử commit (`beat`) rõ ràng, mọi người hãy tuân thủ quy tắc sau:

1. **Không push trực tiếp lên nhánh `main`.**
2. Mỗi khi làm tính năng mới, tạo nhánh theo cú pháp:
   - `feature/ten-tinh-nang` (ví dụ: `feature/login-api`)
   - `fix/ten-loi` (ví dụ: `fix/button-color`)
3. Cú pháp commit rõ ràng: `[Loại]: Mô tả ngắn gọn`. (Ví dụ: `[Backend]: Thêm API mượn sách`, `[Frontend]: Hoàn thiện UI trang chủ`).
4. Khi code xong, tạo Pull Request (PR) để các thành viên khác review trước khi merge vào nhánh chính.
