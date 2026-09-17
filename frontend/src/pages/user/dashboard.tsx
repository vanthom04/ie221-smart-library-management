import { DueSoonCard } from "@/features/user-dashboard/components/due-soon-card"
import { BorrowedBooksCard } from "@/features/user-dashboard/components/borrowed-books-card"
import { SuggestedBooksCard } from "@/features/user-dashboard/components/suggested-books-card"
import { DashboardQuickStats } from "@/features/user-dashboard/components/dashboard-quick-stats"
import { RecentActivitiesCard } from "@/features/user-dashboard/components/recent-activities-card"
import { DashboardReminderCard } from "@/features/user-dashboard/components/dashboard-reminder-card"
import { DashboardWelcomeBanner } from "@/features/user-dashboard/components/dashboard-welcome-banner"
import {
  MOCK_SUGGESTED_BOOKS
} from "@/features/user-dashboard/mock-data"

import { useQuickStats } from "@/features/user-dashboard/hooks/use-quick-stats";
import { useBorrowedBooks } from "@/features/user-dashboard/hooks/use-borrow-book";
import { useRecentActivities } from "@/features/user-dashboard/hooks/use-recent-activities"
import { useCurrentUser } from "@/features/profile/hooks/use-current-user"
import { useDueSoonBooks } from "@/features/user-dashboard/hooks/use-due-soon-books"

export const DashboardPage = () => {
  
  const { data: user} = useCurrentUser()
  const { data: stats } = useQuickStats();
  const { data: borrowedBooks } = useBorrowedBooks();
  const { data: recentActivities } = useRecentActivities();
  const { data: dueSoonBooks } = useDueSoonBooks();


  // if (isLoading) {
  //   return <div className="p-6 text-center text-muted-foreground">Đang tải dữ liệu bảng điều khiển...</div>;
  // }

  // if (isError) {
  //   return <div className="p-6 text-center text-red-500">Không thể kết nối đến máy chủ. Vui lòng thử lại sau!</div>;
  // }

  const handleRenewBook = (_bookId: string) => {
    // Sẽ kết nối với API gia hạn sách mượn
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
      {/* Cột nội dung chính */}
      <div className="flex flex-col gap-6">
        <DashboardWelcomeBanner
          userName={user?.full_name}
          subtitle="Hôm nay là một ngày tuyệt vời để học hỏi và khám phá tri thức mới."
        />

        <DashboardQuickStats stats={stats ?? []} />

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BorrowedBooksCard books={borrowedBooks ?? []} onRenew={handleRenewBook} />
          <RecentActivitiesCard activities={recentActivities ?? []} />
        </section>
      </div>

      {/* Cột Sidebar bên phải */}
      <aside className="flex flex-col gap-6">
        <SuggestedBooksCard books={MOCK_SUGGESTED_BOOKS} />
        <DueSoonCard books={dueSoonBooks ?? []} />
        <DashboardReminderCard />
      </aside>
    </div>
  )
}
