from typing import Annotated

from fastapi import Depends

from app.api.deps import RefreshTokenRepo, UserRepo
from app.services.auth_service import AuthService


def get_auth_service(users: UserRepo, refresh_tokens: RefreshTokenRepo) -> AuthService:
    return AuthService(users, refresh_tokens)


AuthSvc = Annotated[AuthService, Depends(get_auth_service)]
