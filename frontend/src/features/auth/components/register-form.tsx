import { useState, useTransition } from "react"
import { Link, useNavigate } from "react-router"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"

import { api } from "@/lib/axios"
import { isApiError } from "@/lib/api-error"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAnimatedToast } from "@/components/ui/animated-toast"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { registerSchema, type RegisterValues } from "../schemas"

export const RegisterForm = () => {
  const navigate = useNavigate()
  const { addToast } = useAnimatedToast()

  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const onSubmit = (values: RegisterValues) => {
    startTransition(async () => {
      await api
        .post("/auth/register", values)
        .then(() => {
          addToast({
            type: "success",
            title: "Đăng ký thành công.",
            message: "Vui lòng đăng nhập lại!"
          })
          navigate("/login", { replace: true })
        })
        .catch((error) => {
          if (!isApiError(error)) {
            return addToast({ type: "error", message: "Có lỗi xảy ra vui lòng thử lại sau!" })
          }

          if (error.status === 422 && error.fieldErrors) {
            error.fieldErrors.forEach(({ field, message }) => {
              form.setError(field as keyof RegisterValues, { message })
            })
            return
          }

          addToast({ type: "error", message: error.message })
        })
    })
  }

  const onSocial = () => {
    addToast({ type: "info", message: "Tính năng đang được phát triển!" })
  }

  return (
    <Card className="w-full max-w-120 shadow-md ring-ring/10">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-2xl font-bold">Đăng ký tài khoản</CardTitle>
        <CardDescription>Tạo tài khoản mới để sử dụng dịch vụ</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form id="form-register" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            control={form.control}
            name="full_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Họ và tên</FieldLabel>
                <div className="relative">
                  <MailIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    disabled={isPending}
                    autoComplete="name"
                    className="h-10 pl-10"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập họ và tên của bạn"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <div className="relative">
                  <MailIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type="email"
                    id={field.name}
                    name={field.name}
                    disabled={isPending}
                    autoComplete="email"
                    className="h-10 pl-10"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nhập email của bạn"
                  />
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
                <div className="relative">
                  <LockIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    disabled={isPending}
                    placeholder="Nhập mật khẩu"
                    className="h-10 px-10"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={isPending}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 [&_svg]:size-4.5 [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground"
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Xác nhận mật khẩu</FieldLabel>
                <div className="relative">
                  <LockIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    disabled={isPending}
                    placeholder="Nhập lại mật khẩu"
                    className="h-10 px-10"
                    type={showConfirmPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={isPending}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 [&_svg]:size-4.5 [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button form="form-register" type="submit" disabled={isPending} className="h-10 w-full">
            {isPending ? (
              <>
                Đang đăng ký <Spinner />
              </>
            ) : (
              <>
                Đăng ký <ArrowRightIcon />
              </>
            )}
          </Button>
        </form>
        <div className="mx-8 mt-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-muted-foreground/15" />
          <span className="text-xs text-muted-foreground">hoặc đăng ký với</span>
          <div className="h-px flex-1 bg-muted-foreground/15" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={onSocial}
            className="h-10 bg-transparent hover:bg-background"
          >
            <img className="size-4" src="/icons/google.svg" alt="Google" />
            <span className="text-[13px]">Đăng ký với Google</span>
          </Button>
          <Button
            variant="outline"
            onClick={onSocial}
            className="h-10 bg-transparent hover:bg-background"
          >
            <img className="size-4" src="/icons/facebook.svg" alt="Facebook" />
            <span className="text-[13px]">Đăng ký với Facebook</span>
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/90 hover:underline hover:underline-offset-4"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
