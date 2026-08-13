# 📚 Hệ Thống Quản Lý Thư Viện & Mượn Trả Sách Thông Minh

Đây là kho lưu trữ mã nguồn (repository) cho đồ án kết thúc môn: **Kỹ thuật lập trình Python (IE221)**. Dự án được phát triển theo mô hình Client-Server với giao diện người dùng hiện đại và hệ thống xử lý backend hiệu năng cao, tích hợp AI để tối ưu hóa trải nghiệm mượn trả sách.

## 👥 Danh sách thành viên (Nhóm 11)

| STT | Tên thành viên  |   MSSV   | Vai trò |
| :-: | :-------------- | :------: | :------ |
|  1  | Trần Ngọc Tâm   | 25410300 | ?       |
|  2  | Hồ Thiên Phúc   | 25410284 | ?       |
|  3  | Chu Văn Thơm    | 25410314 | ?       |
|  4  | Trần Bình Trọng | 25410324 | ?       |
|  5  | Lê Thanh Quốc   | 25410289 | ?       |

## 🚀 Công nghệ sử dụng

- **Backend:** Python 3, FastAPI. Quản lý môi trường và package bằng `uv`.
- **Frontend:** ReactJS (khởi tạo qua Vite), JavaScript/TypeScript.
- **Cơ sở dữ liệu:** PostgreSQL / MySQL (kết hợp SQLAlchemy ORM).
- **Tích hợp AI:** Sử dụng API của [DeepSeek/OpenAI] để hỗ trợ gợi ý sách thông minh.

## 📂 Cấu trúc thư mục (Monorepo)

Dự án được chia thành 2 phân hệ chính nằm trong cùng một repository để dễ dàng quản lý cho làm việc nhóm:

```text
ie221-smart-library-management/
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
│  │  ├─ assets/                 # Hình ảnh, icon, font chữ
│  │  ├─ components/             # Các component dùng chung (Button, Modal, Navbar...)
│  │  ├─ pages/                  # Các trang chính (Home, Login, Dashboard, Search)
│  │  ├─ services/               # Các file gọi API đến backend (fetch/axios)
│  │  ├─ hooks/                  # Custom React Hooks
│  │  ├─ utils/                  # Các hàm tiện ích (format ngày, tiền tệ...)
│  │  └─ main.jsx                # Entry point của React
│  ├─ package.json               # Quản lý thư viện Node.js
│  └─ .env                       # (Không commit) Cấu hình URL gọi API
│
├─ docs/                         # Tài liệu của đồ án (Bắt buộc)
│  ├─ BaoCao_Final.pdf           # Báo cáo chi tiết nghiệp vụ và hệ thống
│  ├─ Slide_Final.pdf            # Slide thuyết trình (Tối đa 10-12 trang)
│  └─ KhaiBaoAI.md               # Bảng kê khai chi tiết các prompt AI đã dùng
│
├─ README.md                     # Hướng dẫn dự án
└─ .gitignore                    # Bỏ qua các file không cần thiết khi commit
```

## 🛠 Hướng dẫn cài đặt và chạy dự án

### 1. Yêu cầu hệ thống (Prerequisites)

- **Python:** >= 3.10
- **uv:** Công cụ quản lý package Python cực nhanh (Cài đặt: `curl -LsSf https://astral.sh/uv/install.sh | sh`)
- **Node.js:** >= 18.x
- **Git**

### 2. Khởi chạy Backend (FastAPI)

Mở terminal và di chuyển vào thư mục `backend`:

```bash
cd backend

# Cài đặt các thư viện (uv sẽ tự động đọc từ pyproject.toml và tạo virtual environment)
uv sync

# Kích hoạt môi trường ảo (Tuỳ HĐH)
source .venv/bin/activate     # MacOS/Linux
source .venv/Scripts/activate # Git Bash
.venv\Scripts\activate        # Windows

# Chạy server ở chế độ dev
uv run fastapi dev
```

API Documentation (Scalar UI) sẽ có tại: `http://localhost:8000/docs`

### 3. Khởi chạy Frontend (ReactJS)

Mở một terminal MỚI và di chuyển vào thư mục `frontend`:

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
