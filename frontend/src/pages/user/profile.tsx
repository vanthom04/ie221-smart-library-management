import { useState } from "react"
import { m, AnimatePresence } from "motion/react"
import { CalendarIcon, LockIcon, MailIcon, PhoneIcon, User2Icon } from "lucide-react"

import { ProfileTab } from "@/features/profile/components/profile-tab"
import { SecurityTab } from "@/features/profile/components/security-tab"

import { cn, formatPhoneNumber, getInitials } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useCurrentUser } from "@/features/profile/hooks/use-current-user"
import { useQuickStats } from "@/features/user-dashboard/hooks/use-quick-stats"

type Tab = "profile" | "security"

const TABS = [
  { id: "profile", label: "Thông tin cá nhân", icon: User2Icon },
  { id: "security", label: "Bảo mật", icon: LockIcon }
] as const

export const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const { data: currentUser } = useCurrentUser()
  const { data: quickStats = [] } = useQuickStats()

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
                <m.div
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
                    <AvatarImage src={currentUser?.avatar_url ?? ""} />
                    <AvatarFallback className="text-3xl">
                      {getInitials(currentUser?.full_name ?? "User")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <p className="text-lg font-semibold text-foreground">
                    {currentUser?.full_name ?? "Độc giả"}
                  </p>
                  <div className="flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    <span>{currentUser?.role === "admin" ? "Quản trị viên" : "Độc giả"}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex w-full flex-col items-start gap-2">
                <div className="flex w-full items-center gap-2">
                  <MailIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{currentUser?.email ?? "—"}</span>
                </div>
                {currentUser?.phone && (
                  <div className="flex w-full items-center gap-2">
                    <PhoneIcon className="size-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formatPhoneNumber(currentUser.phone)}
                    </span>
                  </div>
                )}
                <div className="flex w-full items-center gap-2">
                  <CalendarIcon className="size-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {currentUser?.created_at
                      ? `Tham gia: ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(currentUser.created_at))}`
                      : "Thành viên thư viện"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Quick */}
          <Card className="rounded-lg py-5 shadow-sm">
            <CardContent className="space-y-3 px-5">
              <h3 className="text-sm font-semibold text-foreground">Thống kê hoạt động</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickStats && quickStats.length > 0 ? (
                  quickStats.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-base font-bold text-blue-600">
                        {item.value}
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs leading-tight font-medium text-foreground">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-2 text-xs text-muted-foreground">
                    Chưa có hoạt động mượn trả nào.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Right Column */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === "profile" && <ProfileTab />}
            {activeTab === "security" && <SecurityTab />}
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
