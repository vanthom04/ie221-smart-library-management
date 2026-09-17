from fastapi import APIRouter
from app.api.deps import CurrentUser
from app.api.v1.dashboard.deps import DashboardSvc
from app.schemas.dashboard import DashboardQuickStatResponse, BorrowedBookResponse, ActivityItemResponse, DueSoonBookResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/user/quick-stats", response_model=list[DashboardQuickStatResponse])
async def read_user_quick_stats(
    current_user: CurrentUser,
    dashboard_service: DashboardSvc
) -> list[DashboardQuickStatResponse]:
    """Lấy dữ liệu thống kê nhanh cho trang cá nhân của user hiện tại."""
    return await dashboard_service.get_user_quick_stats(current_user.id)

@router.get("/user/borrowed-books", response_model=list[BorrowedBookResponse])
async def read_user_borrowed_books(
    current_user: CurrentUser,
    dashboard_service: DashboardSvc
) -> list[BorrowedBookResponse]:
    """Lấy danh sách sách đang mượn của độc giả hiện tại."""
    return await dashboard_service.get_user_borrowed_books(current_user.id)

@router.get("/user/recent-activities", response_model=list[ActivityItemResponse])
async def read_user_recent_activities(
    current_user: CurrentUser,
    dashboard_service: DashboardSvc
) -> list[ActivityItemResponse]:
    """Lấy danh sách nhật ký hoạt động gần đây của độc giả."""
    return await dashboard_service.get_user_recent_activities(current_user.id)

@router.get("/user/due-soon-books", response_model=list[DueSoonBookResponse])
async def read_user_due_soon_books(
    current_user: CurrentUser,
    dashboard_service: DashboardSvc
) -> list[DueSoonBookResponse]:
    """Lấy danh sách sách sắp đến hạn của độc giả hiện tại."""
    return await dashboard_service.get_user_due_soon_books(current_user.id)