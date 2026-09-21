from typing import Annotated

from fastapi import APIRouter, Cookie, Response, status

from app.api.deps import CurrentUser
from app.api.v1.auth.deps import AuthSvc
from app.core.config import settings
from app.core.exceptions import InvalidTokenError
from app.schemas.auth import ChangePasswordRequest, LoginRequest
from app.schemas.token import Token
from app.schemas.user import CreateUser, UserRead

router = APIRouter(prefix="/auth", tags=["Authentication"])

REFRESH_COOKIE_NAME = "refresh_token"
REFRESH_COOKIE_PATH = f"{settings.API_V1_PREFIX}/auth"


def _set_refresh_cookie(response: Response, refresh_token: str) -> None:
    """Giới hạn cookie ở `/auth`; HttpOnly và SameSite giảm rủi ro XSS/CSRF."""
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite="lax",
        path=REFRESH_COOKIE_PATH,
    )


def _clear_refresh_cookie(response: Response) -> None:
    """Phải dùng cùng path lúc tạo cookie, nếu không trình duyệt sẽ giữ cookie cũ."""
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path=REFRESH_COOKIE_PATH)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: CreateUser, auth_service: AuthSvc) -> UserRead:
    user = await auth_service.register(
        full_name=payload.full_name, email=payload.email, password=payload.password
    )
    return UserRead.model_validate(user)


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, auth_service: AuthSvc, response: Response) -> Token:
    """Chỉ trả access token trong JSON; refresh token được giữ trong cookie HttpOnly."""
    user = await auth_service.authenticate(email=payload.email, password=payload.password)
    tokens = await auth_service.issue_tokens(user)
    _set_refresh_cookie(response, tokens.refresh_token)
    return Token(access_token=tokens.access_token)


@router.post("/refresh", response_model=Token)
async def refresh(
    auth_service: AuthSvc,
    response: Response,
    refresh_token: Annotated[str | None, Cookie(alias=REFRESH_COOKIE_NAME)] = None,
) -> Token:
    """Rotate cả cookie và bản ghi DB để refresh token cũ không thể dùng lại."""
    if refresh_token is None:
        raise InvalidTokenError("Không tìm thấy refresh token!")

    tokens = await auth_service.refresh(refresh_token)
    _set_refresh_cookie(response, tokens.refresh_token)
    return Token(access_token=tokens.access_token)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    auth_service: AuthSvc,
    response: Response,
    refresh_token: Annotated[str | None, Cookie(alias=REFRESH_COOKIE_NAME)] = None,
) -> None:
    """Luôn xóa cookie phía client, kể cả khi token DB không còn hợp lệ."""
    if refresh_token is not None:
        await auth_service.logout(refresh_token)  # Thu hồi refresh token trong DB
    _clear_refresh_cookie(response)


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    payload: ChangePasswordRequest,
    current_user: CurrentUser,
    auth_service: AuthSvc,
    response: Response,
) -> None:
    """Đổi mật khẩu đồng thời vô hiệu hóa mọi phiên và xóa cookie hiện hành."""
    await auth_service.change_password(
        current_user,
        current_password=payload.current_password,
        new_password=payload.new_password,
    )
    _clear_refresh_cookie(response)
