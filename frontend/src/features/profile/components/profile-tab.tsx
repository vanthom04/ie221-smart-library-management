import {
  CalendarIcon,
  CheckCircle2Icon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  User2Icon
} from "lucide-react"

import { useCurrentUser } from "../hooks/use-current-user"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"

export const ProfileTab = () => {
  const { data: currentUser } = useCurrentUser()

  const formattedDate = currentUser?.created_at
    ? new Date(currentUser.created_at).toLocaleDateString("vi-VN")
    : "—"

  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
          <p className="text-sm text-muted-foreground">
            Thông tin chi tiết tài khoản độc giả trong hệ thống.
          </p>
        </div>
        <div id="form-profile" className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="full_name">Họ và tên</FieldLabel>
              <div className="relative">
                <User2Icon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="full_name"
                  value={currentUser?.full_name ?? ""}
                  readOnly={true}
                  className="h-10 pl-10"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={currentUser?.email ?? ""}
                  readOnly={true}
                  className="h-10 pl-10"
                />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
              <div className="relative">
                <PhoneIcon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  value={currentUser?.phone ?? "Chưa cập nhật"}
                  readOnly={true}
                  className="h-10 pl-10"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="role">Vai trò</FieldLabel>
              <div className="relative">
                <ShieldCheckIcon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="role"
                  value={currentUser?.role === "admin" ? "Quản trị viên" : "Độc giả"}
                  readOnly={true}
                  className="h-10 pl-10"
                />
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="status">Trạng thái tài khoản</FieldLabel>
              <div className="relative">
                <CheckCircle2Icon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="status"
                  value={currentUser?.status === "active" ? "Đang hoạt động" : "Bị khóa"}
                  readOnly={true}
                  className="h-10 pl-10"
                />
              </div>
            </Field>

            <Field>
              <FieldLabel htmlFor="created_at">Ngày tham gia</FieldLabel>
              <div className="relative">
                <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="created_at"
                  value={formattedDate}
                  readOnly={true}
                  className="h-10 pl-10"
                />
              </div>
            </Field>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
