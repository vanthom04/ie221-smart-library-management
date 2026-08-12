# 🖥️ Frontend — Smart Library Management

Giao diện người dùng cho hệ thống Quản Lý Thư Viện & Mượn Trả Sách Thông Minh, được xây dựng với **React 19**, **TypeScript**, và **Vite**.

## 🚀 Công nghệ sử dụng

| Công nghệ                                                | Phiên bản | Mục đích                                    |
| :------------------------------------------------------- | :-------: | :------------------------------------------ |
| [React](https://react.dev/)                              |   19.x    | Thư viện UI                                 |
| [TypeScript](https://www.typescriptlang.org/)            |    6.x    | Type safety                                 |
| [Vite](https://vite.dev/)                                |    8.x    | Build tool & dev server                     |
| [React Router](https://reactrouter.com/)                 |    8.x    | Client-side routing                         |
| [shadcn/ui](https://ui.shadcn.com/)                      |     —     | Component library (Radix UI + Tailwind CSS) |
| [Axios](https://axios-http.com/)                         |    1.x    | HTTP client                                 |
| [Tailwind CSS](https://tailwindcss.com/)                 |    4.x    | Utility-first CSS                           |
| [React Compiler](https://react.dev/learn/react-compiler) |    1.x    | Tối ưu re-render tự động                    |
| [Recharts](https://recharts.org/)                        |    3.x    | Thư viện biểu đồ                            |
| [Lucide React](https://lucide.dev/)                      |    1.x    | Icon library                                |
| [ESLint](https://eslint.org/)                            |   10.x    | Code linting                                |
| [Prettier](https://prettier.io/)                         |    3.x    | Code formatting                             |

## 📂 Cấu trúc thư mục

```text
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui components (61 components)
│   ├── hooks/               # Custom hooks (use-mobile.ts)
│   ├── layouts/             # Layout components
│   ├── lib/                 # Utility functions (api.ts, utils.ts)
│   ├── pages/               # Page components
│   │   ├── auth/            # Trang xác thực (Login, Register, ...)
│   │   └── home/            # Trang chủ
│   ├── services/            # API service layer
│   ├── App.tsx              # App component (Routes + Suspense)
│   ├── main.tsx             # Entry point (BrowserRouter + Providers)
│   └── globals.css          # Global styles + Tailwind CSS
├── index.html               # HTML entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.app.json        # TypeScript config cho app
├── tsconfig.node.json       # TypeScript config cho Node
├── eslint.config.js         # ESLint configuration
├── prettier.config.js       # Prettier configuration
├── components.json          # shadcn/ui configuration
├── package.json             # Dependencies & scripts
└── .env.example             # Biến môi trường mẫu
```

## 🛠️ Hướng dẫn cài đặt

### Yêu cầu

- **Node.js** >= 18.x
- **npm** >= 9.x (hoặc tương đương)

### Cài đặt và chạy

```bash
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt dependencies
npm install

# 3. Tạo file biến môi trường
cp .env.example .env

# 4. Cấu hình biến môi trường trong file .env
#    VITE_API_URL=http://localhost:8000  (URL của backend API)

# 5. Khởi chạy dev server
npm run dev
```

Giao diện sẽ chạy tại: **<http://localhost:5173>**

### Các lệnh có sẵn

| Lệnh               | Mô tả                        |
| :----------------- | :--------------------------- |
| `npm run dev`      | Khởi chạy development server |
| `npm run build`    | Build production             |
| `npm run preview`  | Preview bản build production |
| `npm run lint`     | Kiểm tra lỗi code với ESLint |
| `npm run lint:fix` | Tự động sửa lỗi ESLint       |
| `npm run format`   | Format code với Prettier     |

## 🏗️ Kiến trúc

### Routing (React Router v8)

Sử dụng **React Router v8** với lazy loading để tối ưu hiệu năng:

```tsx
// App.tsx
const HomePage = lazy(() => import("@/pages/home"))

export const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Thêm các route mới tại đây */}
      </Routes>
    </Suspense>
  )
}
```

### API Layer

HTTP client được cấu hình tại `src/lib/api.ts` sử dụng Axios. Tất cả request đến backend đều đi qua instance này.

### Providers

Trong `main.tsx`, app được wrap bởi các providers:

- **BrowserRouter** — Điều hướng client-side
- **TooltipProvider** — shadcn/ui tooltip context
- **Toaster** — Toast notifications (sonner)

## 🎨 UI Components (shadcn/ui)

Đã có **61 components** sẵn sàng sử dụng. Thêm component mới:

```bash
npx shadcn@latest add <component-name>
```

Xem danh sách components tại: [shadcn/ui docs](https://ui.shadcn.com/docs/components)

## 📝 Path Alias

Sử dụng `@` để import từ thư mục `src/`:

```typescript
// Thay vì:
import { Button } from '../../../components/ui/button'

// Sử dụng:
import { Button } from '@/components/ui/button'
```

## ⚙️ Biến môi trường

| Biến           | Mô tả               | Giá trị mặc định        |
| :------------- | :------------------ | :---------------------- |
| `VITE_API_URL` | URL của Backend API | `http://localhost:8000` |

> **Lưu ý:** Tất cả biến môi trường trong Vite phải có prefix `VITE_` để được expose ra client-side.
