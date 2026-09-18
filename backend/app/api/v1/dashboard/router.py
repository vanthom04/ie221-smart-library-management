import uuid

from fastapi import APIRouter, Depends, Query
from app.api.deps import CurrentUser, require_admin
from app.api.v1.dashboard.deps import DashboardSvc
from app.schemas.dashboard import (
    ActivityItemResponse,
    AdminPendingRequestResponse,
    AdminQuickStatResponse,
    AdminRecentBorrowResponse,
    BorrowedBookResponse,
    BorrowOverviewResponse,
    CategoryStatResponse,
    DashboardQuickStatResponse,
    DueSoonBookResponse,
)

user_router = APIRouter(prefix="/dashboard/user", tags=["User Dashboard"])

admin_router = APIRouter(
    prefix="/dashboard/admin",
    tags=["Admin Dashboard"],
    dependencies=[Depends(require_admin)],
)

# ==========================================
# USER ENDPOINTS
# ==========================================

@user_router.get("/quick-stats", response_model=list[DashboardQuickStatResponse])
async def read_user_quick_stats(
    current_user: CurrentUser,
    dashboard_service: DashboardSvc
) -> list[DashboardQuickStatResponse]:
    """Lấy dữ liệu thống kê nhanh cho trang cá nhân của user hiện tại."""
    return await dashboard_service.get_user_quick_stats(current_user.id)

@user_router.get("/borrowed-books", response_model=list[BorrowedBookResponse])
async def read_user_borrowed_books(
    current_user: CurrentUser,
    dashboard_service: DashboardSvc
) -> list[BorrowedBookResponse]:
    """Lấy danh sách sách đang mượn của độc giả hiện tại."""
    return await dashboard_service.get_user_borrowed_books(current_user.id)

@user_router.get("/recent-activities", response_model=list[ActivityItemResponse])
async def read_user_recent_activities(
    current_user: CurrentUser,
    dashboard_service: DashboardSvc
) -> list[ActivityItemResponse]:
    """Lấy danh sách nhật ký hoạt động gần đây của độc giả."""
    return await dashboard_service.get_user_recent_activities(current_user.id)

@user_router.get("/due-soon-books", response_model=list[DueSoonBookResponse])
async def read_user_due_soon_books(
    current_user: CurrentUser,
    dashboard_service: DashboardSvc
) -> list[DueSoonBookResponse]:
    """Lấy danh sách sách sắp đến hạn của độc giả hiện tại."""
    return await dashboard_service.get_user_due_soon_books(current_user.id)

# ==========================================
# ADMIN ENDPOINTS
# ==========================================

@admin_router.get("/stats", response_model=list[AdminQuickStatResponse])
async def read_admin_stats(
    dashboard_service: DashboardSvc
) -> list[AdminQuickStatResponse]:
    """Lấy dữ liệu tổng quan thống kê cho trang quản trị Admin."""
    return await dashboard_service.get_admin_stats()

@admin_router.get("/pending-requests", response_model=list[AdminPendingRequestResponse])
async def read_admin_pending_requests(
    dashboard_service: DashboardSvc
) -> list[AdminPendingRequestResponse]:
    """Lấy danh sách các yêu cầu mượn/trả sách đang chờ Admin phê duyệt."""
    return await dashboard_service.get_admin_pending_requests()

@admin_router.post("/requests/{record_id}/approve")
async def approve_borrow_request(
    record_id: uuid.UUID,
    dashboard_service: DashboardSvc
) -> dict:
    """Phê duyệt yêu cầu mượn sách của độc giả."""
    await dashboard_service.approve_borrow_request(record_id)
    return {"message": "Phê duyệt yêu cầu thành công"}

@admin_router.post("/requests/{record_id}/reject")
async def reject_borrow_request(
    record_id: uuid.UUID,
    dashboard_service: DashboardSvc
) -> dict:
    """Từ chối yêu cầu mượn sách của độc giả."""
    await dashboard_service.reject_borrow_request(record_id)
    return {"message": "Từ chối yêu cầu thành công"}

@admin_router.get("/recent-borrows", response_model=list[AdminRecentBorrowResponse])
async def read_admin_recent_borrows(
    dashboard_service: DashboardSvc
) -> list[AdminRecentBorrowResponse]:
    """Lấy danh sách nhật ký mượn/trả gần đây cho trang Admin."""
    return await dashboard_service.get_admin_recent_borrows()

@admin_router.get("/category-stats", response_model=list[CategoryStatResponse])
async def read_admin_category_stats(
    dashboard_service: DashboardSvc
) -> list[CategoryStatResponse]:
    """Lấy thống kê thể loại sách yêu thích dựa trên lịch sử mượn của người dùng hiện tại."""
    return await dashboard_service.get_admin_category_stats()

@admin_router.get("/borrow-overview", response_model=BorrowOverviewResponse)
async def read_admin_borrow_overview(
    dashboard_service: DashboardSvc,
    period: str = Query("3m", pattern="^(3m|6m|12m)$")
) -> BorrowOverviewResponse:
    """Lấy thống kê tổng quan mượn sách toàn hệ thống cho Admin theo khoảng thời gian."""
    return await dashboard_service.get_admin_borrow_overview(period)