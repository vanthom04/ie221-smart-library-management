from typing import Optional
from pydantic import BaseModel

# Schema chung cơ bản
class AuthorBase(BaseModel):
    name: str
    bio: Optional[str] = None

# Schema dùng khi tạo mới Tác giả (Client gửi lên)
class AuthorCreate(AuthorBase):
    pass

# Schema dùng khi cập nhật Tác giả
class AuthorUpdate(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None

# Schema dùng khi trả về dữ liệu cho Client (đọc từ DB)
class AuthorResponse(AuthorBase):
    id: int

    class Config:
        from_attributes = True