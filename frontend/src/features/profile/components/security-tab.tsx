import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, useWatch } from "react-hook-form"
import { CheckIcon, EyeIcon, EyeOffIcon, LockIcon, ShieldIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"

import { changePasswordSchema, type ChangePasswordValues } from "../schemas"

const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: "Chưa nhập", color: "bg-gray-200" }

  let score = 0
  if (password.length >= 6) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  // Đảm bảo có ít nhất 1 vạch nếu người dùng đã gõ ký tự nhưng chưa đạt tiêu chí nào
  if (score === 0 && password.length > 0) score = 1

  switch (score) {
    case 1:
      return { score, label: "Yếu", color: "bg-red-500" }
    case 2:
      return { score, label: "Trung bình", color: "bg-yellow-500" }
    case 3:
      return { score, label: "Khá", color: "bg-blue-500" }
    case 4:
      return { score, label: "Mạnh", color: "bg-green-500" }
    default:
      return { score: 0, label: "Chưa nhập", color: "bg-gray-200" }
  }
}

export const SecurityTab = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: ""
    }
  })

  const newPasswordValue = useWatch({ control: form.control, name: "new_password" })
  const strength = getPasswordStrength(newPasswordValue)

  const onSubmit = (values: ChangePasswordValues) => {
    console.info({ values })
  }

  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Đổi mật khẩu</h3>
          <p className="text-sm text-muted-foreground">
            Cập nhật mật khẩu để bảo vệ tài khoản của bạn.
          </p>
        </div>
        <Alert className="border-accent bg-accent px-4 py-3">
          <ShieldIcon className="size-4.5 text-accent-foreground!" />
          <AlertTitle className="text-accent-foreground">
            Mật khẩu mạnh giúp bảo vệ tài khoản của bạn
          </AlertTitle>
          <AlertDescription className="text-slate-600">
            Hãy chọn mật khẩu khó đoán, kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.
          </AlertDescription>
        </Alert>
        <form id="form-password" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            control={form.control}
            name="current_password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mật khẩu hiện tại</FieldLabel>
                <div className="relative">
                  <LockIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    disabled={false}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="h-10 px-10"
                    autoComplete="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={false}
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    aria-label={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 [&_svg]:size-4.5 [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="new_password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mật khẩu mới</FieldLabel>
                <div className="relative">
                  <LockIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    disabled={false}
                    placeholder="Nhập mật khẩu mới"
                    className="h-10 px-10"
                    autoComplete="new-password"
                    type={showNewPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={false}
                    onClick={() => setShowNewPassword((v) => !v)}
                    aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 [&_svg]:size-4.5 [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground"
                  >
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <FieldDescription className="mt-0.5!">
                  Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc
                  biệt.
                </FieldDescription>
                <div className="flex items-center gap-3 text-sm">
                  <span className="whitespace-nowrap text-muted-foreground">Độ mạnh mật khẩu:</span>
                  <div className="flex flex-1 items-center gap-1.5">
                    {[1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all duration-300",
                          index <= strength.score ? strength.color : "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                  <span className="min-w-17.5 text-right whitespace-nowrap text-muted-foreground">
                    {strength.label}
                  </span>
                </div>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="confirm_password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Xác nhận mật khẩu mới</FieldLabel>
                <div className="relative">
                  <LockIcon className="absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    id={field.name}
                    name={field.name}
                    disabled={false}
                    placeholder="Nhập lại mật khẩu mới"
                    className="h-10 px-10"
                    autoComplete="off"
                    type={showConfirmPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    disabled={false}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute top-1/2 right-3 -translate-y-1/2 [&_svg]:size-4.5 [&_svg]:text-muted-foreground hover:[&_svg]:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <FieldDescription>Vui lòng nhập lại mật khẩu mới để xác nhận.</FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <div className="rounded-lg border border-border p-4">
            <p className="text-sm font-semibold text-foreground">Mẹo tạo mật khẩu mạnh</p>
            <ul className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckIcon className="size-3.5 text-green-600" />
                <span>Tối thiểu 6 ký tự</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="size-3.5 text-green-600" />
                <span>Bao gồm chữ hoa, chữ thường và số</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="size-3.5 text-green-600" />
                <span>Bao gồm ít nhất một ký tự đặc biệt (!, @, #, $, v.v.)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckIcon className="size-3.5 text-green-600" />
                <span>Không sử dụng thông tin cá nhân dễ đoán</span>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              // onClick={() => setIsEdited(false)}
              className="h-10 px-4 hover:bg-blue-50 hover:text-blue-600"
            >
              Hủy
            </Button>
            <Button form="form-password" type="submit" disabled={false} className="h-10 px-4">
              <LockIcon /> Cập nhật mật khẩu
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
