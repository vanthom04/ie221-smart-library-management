import uuid

from pydantic import BaseModel


class Token(BaseModel):
    """Chỉ đưa access token vào JSON; giữ refresh token trong cookie HttpOnly."""

    access_token: str
    token_type: str = "bearer"


class TokenPair(BaseModel):
    """Chỉ dùng nội bộ; route tách access token vào JSON và refresh token vào cookie."""

    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    sub: uuid.UUID
    iat: int
    exp: int
