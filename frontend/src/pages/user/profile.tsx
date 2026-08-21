import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  BellIcon,
  BookIcon,
  LockIcon,
  MailIcon,
  StarIcon,
  MarsIcon,
  PhoneIcon,
  User2Icon,
  WalletIcon,
  MapPinIcon,
  CameraIcon,
  SettingsIcon,
  CalendarIcon,
  HourglassIcon,
  AlertTriangleIcon,
  BriefcaseBusinessIcon
} from "lucide-react"

import { ProfileTab } from "@/features/profile/components/profile-tab"
import { SecurityTab } from "@/features/profile/components/security-tab"
import { SettingsTab } from "@/features/profile/components/settings-tab"
import { NotificationsTab } from "@/features/profile/components/notifications-tab"

import { cn, formatPhoneNumber, getInitials } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Tab = "profile" | "security" | "notifications" | "settings"

const TABS = [
  { id: "profile", label: "Thông tin cá nhân", icon: User2Icon },
  { id: "security", label: "Bảo mật", icon: LockIcon },
  { id: "notifications", label: "Thông báo", icon: BellIcon },
  { id: "settings", label: "Thiết lập", icon: SettingsIcon }
] as const

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile")

  const gender = "male"

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hồ sơ cá nhân</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý thông tin cá nhân và bảo mật tài khoản của bạn.
        </p>
      </div>
      {/* Tabs */}
      <div className="flex gap-4 overflow-x-auto border-b border-border">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "relative flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors [&_svg]:size-3.5",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon /> {tab.label}
              {/* Animated Indicator */}
              {isActive && (
                <motion.div
                  initial={false}
                  layoutId="active-tab-indicator"
                  className="absolute right-0 bottom-0 left-0 h-[1.5px] rounded-lg bg-primary"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left Column */}
        <div className="hidden space-y-6 lg:block">
          {/* Card Profile */}
          <Card className="rounded-lg py-5 shadow-sm">
            <CardContent>
              <div className="relative flex flex-col items-center justify-center gap-2">
                <div className="absolute -inset-x-6 -top-6 h-[60%] bg-blue-200" />
                <div className="relative">
                  <Avatar className="size-24 border-3 border-white shadow">
                    <AvatarImage src={"https://github.com/vanthom04.png"} />
                    <AvatarFallback className="text-3xl">{getInitials("vanthom04")}</AvatarFallback>
                  </Avatar>
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute right-0 bottom-0 inline-flex size-6.5 items-center justify-center rounded-full border border-border/60 bg-white shadow hover:bg-muted [&_svg]:size-3.5"
                  >
                    <CameraIcon />
                  </button>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <p className="text-lg font-semibold text-foreground">{"Chu Văn Thơm"}</p>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-2 py-1",
                      gender === "male" ? "bg-blue-500" : "bg-pink-500"
                    )}
                  >
                    <MarsIcon className="size-3 text-white" />
                    <span className="text-xs text-white">{gender === "male" ? "Nam" : "Nữ"}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex w-full flex-col items-start gap-2">
                <div className="flex w-full items-center gap-2">
                  <MailIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{"vanthom04@gmail.com"}</span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <PhoneIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {formatPhoneNumber("0123456789")}
                  </span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <CalendarIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{"01/01/2000"}</span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <StarIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{"Kinh tế học"}</span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <BriefcaseBusinessIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{"Quản trị kinh doanh"}</span>
                </div>
                <div className="flex w-full items-center gap-2">
                  <MapPinIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {"Hồ Chí Minh City, Việt Nam"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Quick */}
          <Card className="rounded-lg py-5 shadow-sm">
            <CardContent className="space-y-3 px-5">
              <h3 className="text-sm font-semibold text-foreground">Thống kê nhanh</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <BookIcon className="size-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="leading-tight font-bold text-foreground">3</p>
                    <p className="text-xs leading-tight text-muted-foreground">Sách đang mượn</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
                    <AlertTriangleIcon className="size-5 text-red-600" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="leading-tight font-bold text-foreground">1</p>
                    <p className="text-xs leading-tight text-muted-foreground">Sách quá hạn</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-50">
                    <HourglassIcon className="size-5 text-green-600" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="leading-tight font-bold text-foreground">2</p>
                    <p className="text-xs leading-tight text-muted-foreground">
                      Đặt trước đang chờ
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-yellow-50">
                    <WalletIcon className="size-5 text-yellow-600" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="leading-tight font-bold text-foreground">25.000đ</p>
                    <p className="text-xs leading-tight text-muted-foreground">
                      Tiền phạt chưa thanh toán
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right Column */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
