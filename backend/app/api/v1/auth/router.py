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
    """Thiết lập HTTP-only cookie chứa Refresh Token vào response.

    Cấu hình cookie an toàn (HttpOnly, Secure, SameSite) để chống lại
    các cuộc tấn công XSS và CSRF. Cookie này chỉ được gửi lên trong
    các request có path thuộc scope của router `/auth`.

    Args:
        response (Response): Đối tượng Response của FastAPI để gắn cookie.
        refresh_token (str): Chuỗi refresh token cần lưu vào cookie.

    Returns:
        None
    """
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
    """Xóa HTTP-only cookie chứa Refresh Token khỏi trình duyệt.

    Sử dụng khi đăng xuất hoặc khi người dùng thay đổi mật khẩu
    để xóa dữ liệu phiên đăng nhập hiện tại trên client.

    Args:
        response (Response): Đối tượng Response của FastAPI để xóa cookie.

    Returns:
        None
    """
    response.delete_cookie(key=REFRESH_COOKIE_NAME, path=REFRESH_COOKIE_PATH)


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def register(payload: CreateUser, auth_service: AuthSvc) -> UserRead:
    """Đăng ký tài khoản người dùng mới.

    API này sẽ kiểm tra email trùng lặp và tiến hành băm (hash) mật khẩu trước khi lưu vào cơ sở dữ liệu.
    Dữ liệu trả về sẽ không bao gồm mật khẩu để đảm bảo an toàn.
    """  # noqa: E501
    user = await auth_service.register(
        full_name=payload.full_name, email=payload.email, password=payload.password
    )
    return UserRead.model_validate(user)


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, auth_service: AuthSvc, response: Response) -> Token:
    """Đăng nhập để nhận Access Token.

    Hệ thống sẽ xác thực email và mật khẩu của người dùng. Nếu thành công:
    - **Access Token** sẽ được trả về trực tiếp trong body (JSON payload).
    - **Refresh Token** sẽ được tự động gắn vào HTTP-only cookie một cách an toàn (trình duyệt tự quản lý, không lộ ra Javascript).
    """  # noqa: E501
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
    """Cấp lại Access Token mới (Token Rotation).

    Lấy Refresh Token từ HTTP-only cookie để xác thực và cấp phát một cặp (Access Token, Refresh Token) mới.
    Refresh Token cũ trong database sẽ bị vô hiệu hóa.

    **Yêu cầu:** Client phải gửi kèm cookie `refresh_token` hợp lệ. Nếu không có hoặc token đã hết hạn, API sẽ trả về lỗi `401`.
    """  # noqa: E501
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
    """Đăng xuất người dùng.

    API sẽ thực hiện hai tác vụ:
    1. Thu hồi (revoke) refresh token hiện tại trong cơ sở dữ liệu (nếu có).
    2. Chỉ thị cho trình duyệt xóa bỏ cookie chứa refresh token ở phía client.
    """
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
    """Thay đổi mật khẩu tài khoản đang đăng nhập.

    Kiểm tra mật khẩu cũ và cập nhật mật khẩu mới.

    **Lưu ý bảo mật:** Sau khi đổi mật khẩu thành công, toàn bộ các phiên đăng nhập (refresh token) của user này trên tất cả các thiết bị sẽ bị vô hiệu hóa, đồng thời xóa cookie hiện hành để buộc client đăng nhập lại.
    """  # noqa: E501
    await auth_service.change_password(
        current_user,
        current_password=payload.current_password,
        new_password=payload.new_password,
    )
    _clear_refresh_cookie(response)
