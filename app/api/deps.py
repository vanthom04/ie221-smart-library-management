from typing import Annotated

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import InsufficientPermissionError, InvalidTokenError
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User, UserRole, UserStatus
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.token import TokenPayload

bearer_scheme = HTTPBearer(description="Dán access_token lấy từ POST /auth/login")

DbSession = Annotated[AsyncSession, Depends(get_db)]
Token = Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)]


def get_user_repository(db: DbSession) -> UserRepository:
    return UserRepository(db)


UserRepo = Annotated[UserRepository, Depends(get_user_repository)]


def get_refresh_token_repository(db: DbSession) -> RefreshTokenRepository:
    return RefreshTokenRepository(db)


RefreshTokenRepo = Annotated[RefreshTokenRepository, Depends(get_refresh_token_repository)]


async def get_current_user(token: Token, users: UserRepo) -> User:
    invalid_token = InvalidTokenError("Không thể xác thực thông tin đăng nhập!")
    try:
        payload = TokenPayload.model_validate(decode_access_token(token.credentials))
    except (jwt.PyJWTError, ValidationError):
        raise invalid_token from None

    user = await users.get_by_id(payload.sub)
    if user is None or user.status != UserStatus.ACTIVE:
        raise invalid_token

    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


# === RBAC ===


def require_roles(*allowed_roles: UserRole):
    async def _check(current_user: CurrentUser) -> User:
        if current_user.role not in allowed_roles:
            raise InsufficientPermissionError("Bạn không có quyền thực hiện hành động này!")
        return current_user

    return _check


require_admin = require_roles(UserRole.ADMIN)
RequireAdmin = Annotated[User, Depends(require_admin)]
