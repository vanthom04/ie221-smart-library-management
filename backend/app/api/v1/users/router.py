import uuid

from fastapi import APIRouter, Depends

from app.api.deps import CurrentUser, require_admin
from app.api.v1.users.deps import UserSvc
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserRead)
async def read_current_user(current_user: CurrentUser) -> UserRead:
    return UserRead.model_validate(current_user)


@router.patch("/{user_id}/lock", response_model=UserRead, dependencies=[Depends(require_admin)])
async def lock_user(user_id: uuid.UUID, user_service: UserSvc) -> UserRead:
    """Khóa tài khoản đồng thời thu hồi toàn bộ refresh token hiện có."""
    user = await user_service.lock(user_id)
    return UserRead.model_validate(user)


@router.patch("/{user_id}/unlock", response_model=UserRead, dependencies=[Depends(require_admin)])
async def unlock_user(user_id: uuid.UUID, user_service: UserSvc) -> UserRead:
    user = await user_service.unlock(user_id)
    return UserRead.model_validate(user)
