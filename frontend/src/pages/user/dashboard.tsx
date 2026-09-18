import { DueSoonCard } from "@/features/user-dashboard/components/due-soon-card"
import { BorrowedBooksCard } from "@/features/user-dashboard/components/borrowed-books-card"
import { SuggestedBooksCard } from "@/features/user-dashboard/components/suggested-books-card"
import { DashboardQuickStats } from "@/features/user-dashboard/components/dashboard-quick-stats"
import { RecentActivitiesCard } from "@/features/user-dashboard/components/recent-activities-card"
import { DashboardReminderCard } from "@/features/user-dashboard/components/dashboard-reminder-card"
import { DashboardWelcomeBanner } from "@/features/user-dashboard/components/dashboard-welcome-banner"

import { useQuickStats } from "@/features/user-dashboard/hooks/use-quick-stats"
import { useBorrowedBooks } from "@/features/user-dashboard/hooks/use-borrow-book"
import { useRecentActivities } from "@/features/user-dashboard/hooks/use-recent-activities"
import { useCurrentUser } from "@/features/profile/hooks/use-current-user"
import { useDueSoonBooks } from "@/features/user-dashboard/hooks/use-due-soon-books"
import { useRecommendations } from "@/features/user-dashboard/hooks/use-recommendations"

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { data: user, isPending: userPending, isError: userError } = useCurrentUser()
  const { data: stats, isPending: statsPending, isError: statsError } = useQuickStats()
  const {
    data: borrowedBooks,
    isPending: borrowedPending,
    isError: borrowedError
  } = useBorrowedBooks()
  const {
    data: recentActivities,
    isPending: activitiesPending,
    isError: activitiesError
  } = useRecentActivities()
  const { data: dueSoonBooks, isPending: duePending, isError: dueError } = useDueSoonBooks()
  const {
    data: suggestions,
    isPending: suggestionsPending,
    isError: suggestionsError
  } = useRecommendations(user?.id)
  const suggestedBooks =
    suggestions?.recommendations.map((book) => ({
      id: book.book_id,
      title: book.title,
      author: book.author ?? "Chưa rõ tác giả",
      category: book.category ?? undefined
    })) ?? []

  const handleRenewBook = () => {
    navigate("/borrow-history")
  }

  const isPending =
    userPending || statsPending || borrowedPending || activitiesPending || duePending
  const isError = userError || statsError || borrowedError || activitiesError || dueError

  return (
    <div className="space-y-4">
      {isPending && <p className="text-sm text-muted-foreground">Đang tải Dashboard...</p>}
      {isError && (
        <p role="alert" className="text-sm text-destructive">
          Không thể tải một phần dữ liệu Dashboard. Vui lòng tải lại trang.
        </p>
      )}
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
          <SuggestedBooksCard
            books={suggestedBooks}
            basedOnBooks={suggestions?.based_on_books}
            isLoading={suggestionsPending}
            isError={suggestionsError}
          />
          <DueSoonCard books={dueSoonBooks ?? []} />
          <DashboardReminderCard />
        </aside>
      </div>
    </div>
  )
}
import { useNavigate } from "react-router"
