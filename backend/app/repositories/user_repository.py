import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserStatus


class UserRepository:
    """Tầng truy xuất dữ liệu cho User. Không chứa business logic."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        return await self._session.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        result = await self._session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, *, full_name: str, email: str, hashed_password: str) -> User:
        user = User(full_name=full_name, email=email, hashed_password=hashed_password)
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def update_password(self, user: User, hashed_password: str) -> User:
        user.hashed_password = hashed_password
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def update_status(self, user: User, status: UserStatus) -> User:
        user.status = status
        await self._session.commit()
        await self._session.refresh(user)
        return user
