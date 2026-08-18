import { BookOpenIcon, CalendarCheckIcon, ChartSplineIcon } from "lucide-react"

import { RegisterForm } from "@/features/auth/components/register-form"

export const RegisterPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      <div className="relative hidden flex-col overflow-hidden lg:flex">
        <div className="z-20 px-10 pt-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="size-11" />
            <div>
              <h1 className="text-lg font-bold">Thư viện thông minh</h1>
              <p className="text-[13px] text-muted-foreground">Tri thức mở - Tương lai rộng</p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <h2 className="text-3xl font-bold">
              Bắt đầu hành trình tri thức <br />
              cùng <span className="text-blue-500">Thư viện thông minh</span>
            </h2>
            <p className="text-[15px] text-accent-foreground">
              Đăng ký tài khoản để khám phá kho sách phong phú, đặt trước, mượn sách và quản lý dễ
              dàng.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100">
                <BookOpenIcon className="size-6 text-blue-500" />
              </div>
              <div className="">
                <h3 className="text-sm font-semibold">Kho sách đa dạng</h3>
                <p className="text-sm text-muted-foreground">
                  Hàng ngàn đầu sách thuộc nhiều lĩnh vực
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-lg bg-green-100">
                <CalendarCheckIcon className="size-6 text-green-500" />
              </div>
              <div className="">
                <h3 className="text-sm font-semibold">Đặt trước dễ dàng</h3>
                <p className="text-sm text-muted-foreground">Đặt trước sách online nhanh chóng</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-12 items-center justify-center rounded-lg bg-purple-100">
                <ChartSplineIcon className="size-6 text-purple-500" />
              </div>
              <div className="">
                <h3 className="text-sm font-semibold">Quản lý thông minh</h3>
                <p className="text-sm text-muted-foreground">
                  Theo dõi lịch sử mượn và hạn trả dễ dàng
                </p>
              </div>
            </div>
          </div>
        </div>
        <img
          src="/images/register-illustration.png"
          alt="Illustration"
          className="relative -mb-28 w-full -translate-y-28"
        />
      </div>
      <div className="flex items-center justify-center px-6 py-12 lg:px-10">
        <RegisterForm />
      </div>
    </div>
  )
}
