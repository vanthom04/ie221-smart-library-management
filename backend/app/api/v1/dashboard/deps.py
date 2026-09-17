from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db  # Dependency lấy DB session chung của ứng dụng
from app.services.dashboard_service import DashboardService


async def get_dashboard_service(
    db: Annotated[AsyncSession, Depends(get_db)]
) -> DashboardService:
    """Dependency cung cấp instance của DashboardService kèm theo DB AsyncSession."""
    return DashboardService(db=db)


# Type Alias giúp inject service gọn gàng hơn ở các route endpoint
DashboardSvc = Annotated[DashboardService, Depends(get_dashboard_service)]