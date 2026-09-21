import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

_password_hash = PasswordHash.recommended()


def hash_password(plain_password: str) -> str:
    """Dùng cấu hình băm khuyến nghị của thư viện để tự nâng cấp thuật toán an toàn."""
    return _password_hash.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Ủy quyền việc so sánh cho thư viện để giữ đặc tính chống timing attack."""
    return _password_hash.verify(plain_password, hashed_password)


def create_access_token(subject: UUID) -> str:
    """Dùng UTC và thời hạn ngắn để access token có thể xác thực phi trạng thái."""
    now = datetime.now(UTC)
    payload = {
        "sub": str(subject),
        "iat": now,
        "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Không tắt kiểm tra chữ ký hay thời hạn; lỗi JWT được tầng gọi ánh xạ thống nhất."""
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def generate_refresh_token() -> str:
    """Dùng bộ sinh mật mã thay cho random vì token đóng vai trò thông tin xác thực."""
    return secrets.token_urlsafe(32)


def hash_refresh_token(token: str) -> str:
    """Chỉ lưu dấu vân tay để dữ liệu DB bị lộ không dùng trực tiếp để cấp token mới."""
    return hashlib.sha256(token.encode()).hexdigest()
