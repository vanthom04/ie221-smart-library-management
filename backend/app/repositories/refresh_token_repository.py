import uuid
from datetime import UTC, datetime

from sqlalchemy import delete, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    """Tầng truy xuất dữ liệu cho RefreshToken. Không chứa business logic."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(
        self, *, user_id: uuid.UUID, hashed_token: str, expires_at: datetime
    ) -> RefreshToken:
        token = RefreshToken(user_id=user_id, hashed_token=hashed_token, expires_at=expires_at)
        self._session.add(token)
        await self._session.commit()
        await self._session.refresh(token)
        return token

    async def get_valid_by_hash(self, hashed_token: str) -> RefreshToken | None:
        result = await self._session.execute(
            select(RefreshToken).where(
                RefreshToken.hashed_token == hashed_token,
                RefreshToken.revoked.is_(False),
                RefreshToken.expires_at > datetime.now(UTC),
            )
        )
        return result.scalar_one_or_none()

    async def revoke(self, token: RefreshToken) -> None:
        token.revoked = True
        await self._session.commit()

    async def rotate(self, token: RefreshToken, *, hashed_token: str, expires_at: datetime) -> None:
        """Ghi đè row hiện có để token cũ mất hiệu lực mà không làm bảng phình to.
        Hash cũ không còn trong DB nên việc tái sử dụng token cũ vẫn thất bại như revoke.
        """
        token.hashed_token = hashed_token
        token.expires_at = expires_at
        await self._session.commit()

    async def revoke_all_for_user(self, user_id: uuid.UUID) -> None:
        """Buộc mọi phiên của người dùng đăng nhập lại sau sự kiện bảo mật."""
        await self._session.execute(
            update(RefreshToken).where(RefreshToken.user_id == user_id).values(revoked=True)
        )
        await self._session.commit()

    async def delete_stale(self) -> int:
        """Chỉ dành cho tác vụ định kỳ; không gọi trong luồng xử lý request."""
        result = await self._session.execute(
            delete(RefreshToken).where(
                or_(RefreshToken.revoked.is_(True), RefreshToken.expires_at < datetime.now(UTC))
            )
        )
        await self._session.commit()
        return result.rowcount  # type: ignore
