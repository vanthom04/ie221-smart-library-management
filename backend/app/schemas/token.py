import uuid

from pydantic import BaseModel


class Token(BaseModel):
    """Response trả về client - chỉ access_token. refresh_token nằm trong httpOnly cookie,
    không bao giờ xuất hiện trong JSON body để JS phía client không đọc được."""

    access_token: str
    token_type: str = "bearer"


class TokenPair(BaseModel):
    """Dùng nội bộ giữa AuthService <-> route auth. Không trả thẳng về client -
    route sẽ tách access_token vào body, refresh_token và cookie."""

    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    sub: uuid.UUID
    iat: int
    exp: int
