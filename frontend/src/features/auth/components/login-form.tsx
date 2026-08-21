import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router"
import { ArrowRightIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"

import { api } from "@/lib/axios"
import { isApiError } from "@/lib/api-error"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useAnimatedToast } from "@/components/ui/animated-toast"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useAuthStore } from "../stores/use-auth-store"
import { loginSchema, type LoginValues } from "../schemas"

export const LoginForm = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const { addToast } = useAnimatedToast()
  const { setAccessToken } = useAuthStore()

  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = (values: LoginValues) => {
    startTransition(async () => {
      await api
        .post<{ access_token: string; type: "bearer" }>("/auth/login", values)
        .then((data) => {
          setAccessToken(data.access_token)
          queryClient.invalidateQueries({ queryKey: ["current-user"] })
          const redirectTo = searchParams.get("redirect") ?? "/"
          navigate(redirectTo, { replace: true })
        })
        .catch((error) => {
          const message = isApiError(error) ? error.message : "Có lỗi xảy ra vui lòng thử lại sau!"
          addToast({ type: "error", message })
        })
    })
  }

  const onSocial = () => {
    addToast({
      type: "info",
      message: "Nút bấm chỉ để làm đẹp, hoàn toàn không có tác dụng."
    })
  }

  return (
    <Card className="w-full max-w-115 shadow-md ring-ring/10">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
        <CardDescription>Nhập email và mật khẩu để tiếp tục</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <form id="form-login" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <div className="relative">
                  <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type="email"
                    id={field.name}
                    name={field.name}
                    disabled={isPending}
                    autoComplete="email"
                    className="h-10 pl-10"
                    aria-invalid={fieldState.invalid}
                    placeholder="example@domain.com"
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
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor={field.name}>Mật khẩu</FieldLabel>
                  <Link
                    tabIndex={-1}
                    to="/forgot-password"
                    className="text-[13px] text-primary hover:underline hover:underline-offset-4"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    disabled={isPending}
                    placeholder="•••••••••••"
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
          <Button form="form-login" type="submit" disabled={isPending} className="h-10 w-full">
            {isPending ? (
              <>
                Đang đăng nhập <Spinner />
              </>
            ) : (
              <>
                Đăng nhập <ArrowRightIcon />
              </>
            )}
          </Button>
        </form>
        <div className="mx-8 mt-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-muted-foreground/15" />
          <span className="text-xs text-muted-foreground">hoặc đăng nhập với</span>
          <div className="h-px flex-1 bg-muted-foreground/15" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={onSocial}
            className="h-10 bg-transparent hover:bg-background"
          >
            <img className="size-4" src="/icons/google.svg" alt="Google" />
            <span className="text-[13px]">Tiếp tục với Google</span>
          </Button>
          <Button
            variant="outline"
            onClick={onSocial}
            className="h-10 bg-transparent hover:bg-background"
          >
            <img className="size-4" src="/icons/facebook.svg" alt="Facebook" />
            <span className="text-[13px]">Tiếp tục với Facebook</span>
          </Button>
        </div>
        <div className="mt-6 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/90 hover:underline hover:underline-offset-4"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
