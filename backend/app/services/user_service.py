import uuid

from app.core.exceptions import UserNotFoundError
from app.models.user import User, UserStatus
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository


class UserService:
    def __init__(
        self, user_repository: UserRepository, refresh_token_repository: RefreshTokenRepository
    ) -> None:
        self._users = user_repository
        self._refresh_tokens = refresh_token_repository

    async def lock(self, user_id: uuid.UUID) -> User:
        """Thu hồi mọi refresh token khi khóa tài khoản.
        Access token đã cấp vẫn sống đến hết TTL vì JWT không lưu trạng thái.
        """
        user = await self._get_or_raise(user_id)
        user = await self._users.update_status(user, UserStatus.LOCKED)
        await self._refresh_tokens.revoke_all_for_user(user.id)
        return user

    async def unlock(self, user_id: uuid.UUID) -> User:
        user = await self._get_or_raise(user_id)
        return await self._users.update_status(user, UserStatus.ACTIVE)

    async def _get_or_raise(self, user_id: uuid.UUID) -> User:
        user = await self._users.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError("Không tìm thấy người dùng!")
        return user
