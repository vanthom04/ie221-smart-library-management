import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole, UserStatus


class CreateUser(BaseModel):
    full_name: str = Field(min_length=3, max_length=150)
    email: EmailStr = Field(max_length=150)
    password: str = Field(min_length=6, max_length=128)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    full_name: str
    email: EmailStr
    phone: str | None
    role: UserRole
    status: UserStatus
    created_at: datetime
    updated_at: datetime
