from typing import Annotated

from fastapi import Depends

from app.api.deps import RefreshTokenRepo, UserRepo
from app.services.user_service import UserService


def get_user_service(users: UserRepo, refresh_tokens: RefreshTokenRepo):
    return UserService(users, refresh_tokens)


UserSvc = Annotated[UserService, Depends(get_user_service)]
