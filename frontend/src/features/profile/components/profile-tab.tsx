import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  Edit3Icon,
  MailIcon,
  MarsIcon,
  PhoneIcon,
  SaveIcon,
  User2Icon,
  VenusIcon,
  CodeIcon,
  UsersIcon,
  AtomIcon,
  StarIcon,
  PaletteIcon,
  MapPinIcon,
  BrainIcon,
  ShapesIcon,
  Wand2Icon,
  BookOpenIcon,
  HardHatIcon,
  LandmarkIcon,
  BriefcaseIcon,
  BookHeartIcon,
  LineChartIcon,
  TrendingUpIcon,
  HeartPulseIcon,
  CalculatorIcon,
  CircleSmallIcon,
  BookOpenTextIcon,
  VenusAndMarsIcon,
  GraduationCapIcon,
  MoreHorizontalIcon,
  BriefcaseBusinessIcon
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCalendar } from "@/components/ui/calendar"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const genderItems = [
  {
    label: "Nam",
    value: "male",
    icon: MarsIcon
  },
  {
    label: "Nữ",
    value: "female",
    icon: VenusIcon
  },
  {
    label: "Khác",
    value: "other",
    icon: CircleSmallIcon
  }
] as const

const jobItems = [
  {
    label: "Học sinh / Sinh viên",
    value: "student",
    icon: GraduationCapIcon
  },
  {
    label: "Công nghệ thông tin / Lập trình",
    value: "it_software",
    icon: CodeIcon
  },
  {
    label: "Giáo dục / Giảng dạy",
    value: "education",
    icon: BookOpenIcon
  },
  {
    label: "Kinh doanh / Bán hàng",
    value: "sales_business",
    icon: BriefcaseIcon
  },
  {
    label: "Thiết kế / Sáng tạo nghệ thuật",
    value: "design_creative",
    icon: PaletteIcon
  },
  {
    label: "Kỹ thuật / Xây dựng",
    value: "engineering_construction",
    icon: HardHatIcon
  },
  {
    label: "Y tế / Chăm sóc sức khỏe",
    value: "healthcare",
    icon: HeartPulseIcon
  },
  {
    label: "Tài chính / Kế toán",
    value: "finance_accounting",
    icon: CalculatorIcon
  },
  {
    label: "Quản lý / Điều hành",
    value: "management",
    icon: UsersIcon
  },
  {
    label: "Ngành nghề khác",
    value: "other",
    icon: MoreHorizontalIcon
  }
] as const

export const categoryItems = [
  {
    label: "Văn học / Tiểu thuyết",
    value: "fiction_literature",
    icon: BookHeartIcon
  },
  {
    label: "Khoa học / Công nghệ",
    value: "science_technology",
    icon: AtomIcon
  },
  {
    label: "Tâm lý học",
    value: "psychology",
    icon: BrainIcon
  },
  {
    label: "Kỹ năng sống / Phát triển bản thân",
    value: "self_help",
    icon: TrendingUpIcon
  },
  {
    label: "Lịch sử / Chính trị",
    value: "history_politics",
    icon: LandmarkIcon
  },
  {
    label: "Kinh doanh / Kinh tế",
    value: "business_economy",
    icon: LineChartIcon
  },
  {
    label: "Tiểu sử / Hồi ký",
    value: "biography",
    icon: BookOpenTextIcon
  },
  {
    label: "Nghệ thuật / Văn hóa",
    value: "art_culture",
    icon: PaletteIcon
  },
  {
    label: "Viễn tưởng / Kỳ ảo",
    value: "fantasy_scifi",
    icon: Wand2Icon
  },
  {
    label: "Sách thiếu nhi",
    value: "children",
    icon: ShapesIcon
  }
] as const

export const ProfileTab = () => {
  const [isEdited, setIsEdited] = useState(false)

  const form = useForm({
    defaultValues: {
      full_name: "Chu Văn Thơm",
      gender: "male",
      email: "vanthom04.dev@gmail.com",
      phone: "0345772899",
      date_of_birth: new Date("2004-01-01"),
      address: "Tp. Hồ Chí Minh, Việt Nam",
      favorite_categories: "Công nghệ",
      job: "IT"
    }
  })

  const onSubmit = (values: Record<string, any>) => {
    const payload = {
      ...values,
      date_of_birth: values.date_of_birth.toISOString()
    }

    console.info(payload)
  }

  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
            <p className="text-sm text-muted-foreground">
              Cập nhật thông tin để thư viện phục vụ bạn tốt hơn.
            </p>
          </div>
          {!isEdited && (
            <Button
              variant="outline"
              onClick={() => setIsEdited(true)}
              className="h-auto px-4 py-2 hover:bg-blue-50 hover:text-blue-600"
            >
              <Edit3Icon /> Chỉnh sửa
            </Button>
          )}
        </div>
        <form id="form-profile" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="full_name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Họ và tên</FieldLabel>
                  <div className="relative">
                    <User2Icon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id={field.name}
                      name={field.name}
                      disabled={false}
                      readOnly={!isEdited}
                      autoComplete="off"
                      className="h-10 pl-10"
                      aria-invalid={fieldState.invalid}
                      placeholder="Nguyễn Văn A"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="gender"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Giới tính</FieldLabel>
                  <div className="relative flex-1">
                    <VenusAndMarsIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Select
                      id={field.name}
                      disabled={false}
                      items={genderItems}
                      readOnly={!isEdited}
                      defaultValue={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="h-10! w-full pl-10"
                      >
                        <SelectValue placeholder="Chọn giới tính" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {genderItems.map((gender) => (
                          <SelectItem key={gender.value} value={gender.value} className="h-10">
                            <gender.icon /> {gender.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                      disabled={false}
                      readOnly={!isEdited}
                      autoComplete="off"
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
              name="phone"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Số điện thoại</FieldLabel>
                  <div className="relative">
                    <PhoneIcon className="pointer-events-none absolute top-1/2 left-3 size-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id={field.name}
                      name={field.name}
                      disabled={false}
                      readOnly={!isEdited}
                      autoComplete="off"
                      className="h-10 pl-10"
                      aria-invalid={fieldState.invalid}
                      placeholder="0123456789"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="date_of_birth"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Ngày sinh</FieldLabel>
                  <AnimatedCalendar
                    mode="single"
                    id={field.name}
                    name={field.name}
                    className="w-full"
                    value={field.value}
                    readOnly={!isEdited}
                    disabled={false}
                    formatStr="dd/MM/yyyy"
                    showClearButton={false}
                    showTodayButton={false}
                    onChange={(date) => {
                      if (date) field.onChange(date)
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Địa chỉ</FieldLabel>
                  <div className="relative">
                    <MapPinIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      id={field.name}
                      name={field.name}
                      disabled={false}
                      readOnly={!isEdited}
                      autoComplete="off"
                      className="h-10 pl-10"
                      aria-invalid={fieldState.invalid}
                      placeholder="Tp. Hồ Chí Minh, Việt Nam"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              control={form.control}
              name="favorite_categories"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Thể loại yêu thích</FieldLabel>
                  <div className="relative flex-1">
                    <StarIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Select
                      id={field.name}
                      items={categoryItems}
                      disabled={false}
                      readOnly={!isEdited}
                      defaultValue={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="h-10! w-full pl-10"
                      >
                        <SelectValue placeholder="Chọn thể loại yêu thích" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {categoryItems.map((category) => (
                          <SelectItem key={category.value} value={category.value} className="h-10">
                            <category.icon /> {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="job"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Công việc</FieldLabel>
                  <div className="relative flex-1">
                    <BriefcaseBusinessIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4.5 -translate-y-1/2 text-muted-foreground" />
                    <Select
                      id={field.name}
                      items={jobItems}
                      disabled={false}
                      readOnly={!isEdited}
                      defaultValue={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className="h-10! w-full pl-10"
                      >
                        <SelectValue placeholder="Chọn công việc" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false}>
                        {jobItems.map((job) => (
                          <SelectItem key={job.label} value={job.value} className="h-10">
                            <job.icon /> {job.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>
          {isEdited && (
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEdited(false)}
                className="h-10 px-4 hover:bg-blue-50 hover:text-blue-600"
              >
                Hủy
              </Button>
              <Button form="form-profile" type="submit" disabled={false} className="h-10 px-4">
                <SaveIcon /> Lưu thay đổi
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
