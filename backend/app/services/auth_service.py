from datetime import UTC, datetime, timedelta

from app.core.config import settings
from app.core.exceptions import EmailAlreadyExistsError, InvalidCredentialsError, InvalidTokenError
from app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from app.models.user import User, UserStatus
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.token import TokenPair


class AuthService:
    def __init__(
        self, user_repository: UserRepository, refresh_token_repository: RefreshTokenRepository
    ) -> None:
        self._users = user_repository
        self._refresh_tokens = refresh_token_repository

    async def register(self, *, full_name: str, email: str, password: str) -> User:
        if await self._users.get_by_email(email) is not None:
            raise EmailAlreadyExistsError("Email đã được sử dụng!")

        return await self._users.create(
            full_name=full_name, email=email, hashed_password=hash_password(password)
        )

    async def authenticate(self, *, email: str, password: str) -> User:
        user = await self._users.get_by_email(email)
        if user is None or not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError("Email hoặc mật khẩu không hợp lệ!")

        if user.status != UserStatus.ACTIVE:
            raise InvalidCredentialsError("Tài khoản đã bị khóa!")

        return user

    async def issue_tokens(self, user: User) -> TokenPair:
        """Chỉ lưu hash của refresh token; access token vẫn hoàn toàn phi trạng thái."""
        access_token = create_access_token(user.id)
        refresh_token = generate_refresh_token()

        await self._refresh_tokens.create(
            user_id=user.id,
            hashed_token=hash_refresh_token(refresh_token),
            expires_at=datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        return TokenPair(access_token=access_token, refresh_token=refresh_token)

    async def refresh(self, refresh_token: str) -> TokenPair:
        """Rotate trên cùng row để token cũ mất hiệu lực mà không tích lũy bản ghi."""
        token_row = await self._refresh_tokens.get_valid_by_hash(hash_refresh_token(refresh_token))
        if token_row is None:
            raise InvalidTokenError("Refresh token không hợp lệ hoặc đã hết hạn!")

        user = await self._users.get_by_id(token_row.user_id)
        if user is None or user.status != UserStatus.ACTIVE:
            raise InvalidTokenError("Tài khoản không tồn tại hoặc đã bị khóa!")

        new_access_token = create_access_token(user.id)
        new_refresh_token = generate_refresh_token()
        await self._refresh_tokens.rotate(
            token_row,
            hashed_token=hash_refresh_token(new_refresh_token),
            expires_at=datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        return TokenPair(access_token=new_access_token, refresh_token=new_refresh_token)

    async def logout(self, refresh_token: str) -> None:
        """Chỉ thu hồi refresh token; access token đã cấp vẫn sống đến hết TTL."""
        token_row = await self._refresh_tokens.get_valid_by_hash(hash_refresh_token(refresh_token))
        if token_row is not None:
            await self._refresh_tokens.revoke(token_row)

    async def change_password(
        self, user: User, *, current_password: str, new_password: str
    ) -> None:
        """Thu hồi mọi refresh token sau khi đổi mật khẩu để buộc đăng nhập lại."""
        if not verify_password(current_password, user.hashed_password):
            raise InvalidCredentialsError("Mật khẩu hiện tại không đúng!")

        await self._users.update_password(user, hash_password(new_password))
        await self._refresh_tokens.revoke_all_for_user(user.id)
