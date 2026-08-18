import { ClockIcon, BookOpenIcon, ShieldCheckIcon } from "lucide-react"

import { LoginForm } from "@/features/auth/components/login-form"

export const LoginPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-background px-10 py-8 lg:flex">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="size-11" />
          <div>
            <h1 className="text-lg font-bold">Thư viện thông minh</h1>
            <p className="text-[13px] text-muted-foreground">Tri thức mở - Tương lai rộng</p>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <h2 className="text-3xl font-bold">
            Chào mừng bạn <span className="text-primary">trở lại!</span>
          </h2>
          <p className="text-[15px] text-accent-foreground">
            Đăng nhập để tiếp tục hành trình khám phá tri thức và quản lý việc mượn sách của bạn.
          </p>
        </div>
        <img src="/images/auth-illustration.png" alt="Illustration" className="w-full" />
        <div className="relative flex items-center justify-around gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
              <BookOpenIcon className="size-6 text-blue-500" />
            </div>
            <h4 className="text-sm font-semibold">Kho sách phong phú</h4>
            <p className="max-w-44 text-center text-xs text-muted-foreground">
              Hàng ngàn đầu sách thuộc nhiều lĩnh vực khác nhau
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
              <ClockIcon className="size-6 text-green-500" />
            </div>
            <h4 className="text-sm font-semibold">Quản lý dễ dàng</h4>
            <p className="max-w-44 text-center text-xs text-muted-foreground">
              Theo dõi lịch mượn, đặt trước và trả sách
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-12 items-center justify-center rounded-full bg-purple-100">
              <ShieldCheckIcon className="size-6 text-purple-500" />
            </div>
            <h4 className="text-sm font-semibold">An toàn & Bảo mật</h4>
            <p className="max-w-44 text-center text-xs text-muted-foreground">
              Thông tin cá nhân của bạn được bảo mật tuyệt đối
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-background px-6 py-12 lg:px-10">
        <LoginForm />
      </div>
    </div>
  )
}
