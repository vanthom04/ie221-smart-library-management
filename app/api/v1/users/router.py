import uuid

from fastapi import APIRouter, Depends

from app.api.deps import CurrentUser, require_admin
from app.api.v1.users.deps import UserSvc
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserRead)
async def read_current_user(current_user: CurrentUser) -> UserRead:
    """Lấy thông tin hồ sơ cá nhân.

    Trả về thông tin chi tiết của người dùng hiện đang đăng nhập (dựa trên Access Token được gửi kèm trong header).
    """  # noqa: E501
    return UserRead.model_validate(current_user)


@router.patch("/{user_id}/lock", response_model=UserRead, dependencies=[Depends(require_admin)])
async def lock_user(user_id: uuid.UUID, user_service: UserSvc) -> UserRead:
    """Khóa tài khoản người dùng.

    Thao tác này sẽ chuyển trạng thái tài khoản sang `LOCKED` và lập tức thu hồi toàn bộ các phiên đăng nhập (refresh token) hiện tại của người dùng đó.

    **Yêu cầu quyền hạn:** Chỉ có Quản trị viên (Admin) mới có thể gọi API này.
    """  # noqa: E501
    user = await user_service.lock(user_id)
    return UserRead.model_validate(user)


@router.patch("/{user_id}/unlock", response_model=UserRead, dependencies=[Depends(require_admin)])
async def unlock_user(user_id: uuid.UUID, user_service: UserSvc) -> UserRead:
    """Mở khóa tài khoản người dùng.

    Khôi phục trạng thái tài khoản về `ACTIVE`, cho phép người dùng tiếp tục đăng nhập và sử dụng hệ thống bình thường.

    **Yêu cầu quyền hạn:** Chỉ có Quản trị viên (Admin) mới có thể gọi API này.
    """  # noqa: E501
    user = await user_service.unlock(user_id)
    return UserRead.model_validate(user)
