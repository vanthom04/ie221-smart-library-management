import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

import jwt
from pwdlib import PasswordHash

from app.core.config import settings

_password_hash = PasswordHash.recommended()


def hash_password(plain_password: str) -> str:
    """Mã hóa mật khẩu dạng văn bản thô (plain text) thành chuỗi băm an toàn.

    Sử dụng thuật toán băm được khuyến nghị từ FastAPI là Argon2.

    Args:
        plain_password (str): Mật khẩu thô do người dùng cung cấp.

    Returns:
        str: Chuỗi mật khẩu đã được băm (kèm salt) để lưu trữ an toàn vào database.
    """
    return _password_hash.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Xác thực mật khẩu thô với chuỗi mật khẩu đã băm trong database.

    Args:
        plain_password (str): Mật khẩu thô người dùng gửi lên khi đăng nhập.
        hashed_password (str): Chuỗi hash mật khẩu đã lưu trong database.

    Returns:
        bool: `True` nếu mật khẩu khớp, ngược lại trả về `False`.
    """
    return _password_hash.verify(plain_password, hashed_password)


def create_access_token(subject: UUID) -> str:
    """Tạo JWT Access Token cho người dùng dựa trên UUID.

    Token bao gồm các trường chuẩn:
    - `sub`: Định danh người dùng (chuyển đổi từ UUID sang chuỗi).
    - `iat`: Thời điểm tạo token (UTC).
    - `exp`: Thời điểm hết hạn (UTC), cấu hình qua `settings.ACCESS_TOKEN_EXPIRE_MINUTES`.

    Args:
        subject (UUID): ID định danh của người dùng/chủ thể token.

    Returns:
        str: Chuỗi JWT Access Token đã được ký điện tử.
    """
    now = datetime.now(UTC)
    payload = {
        "sub": str(subject),
        "iat": now,
        "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Giải mã và xác thực tính hợp lệ của JWT Access Token.

    Kiểm tra chữ ký (signature) và thời hạn hết hạn (`exp`) của token.

    Args:
        token (str): Chuỗi JWT Access Token cần xác thực.

    Returns:
        dict: Payload chứa dữ liệu bên trong token sau khi giải mã.

    Raises:
        jwt.ExpiredSignatureError: Khi token đã quá hạn sử dụng.
        jwt.InvalidTokenError: Khi chữ ký không khớp hoặc định dạng token không hợp lệ.
        jwt.PyJWTError: Lỗi tổng quát từ thư viện PyJWT trong quá trình giải mã.
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def generate_refresh_token() -> str:
    """Tạo chuỗi Refresh Token ngẫu nhiên và an toàn về mặt mật mã học (cryptographically secure).

    Sử dụng module `secrets` để tạo chuỗi ngẫu nhiên 32 bytes dưới dạng base64 URL-safe
    (khoảng 43 ký tự). Token này được trả về cho client để yêu cầu cấp lại access token.

    Returns:
        str: Chuỗi Refresh Token ngẫu nhiên.
    """
    return secrets.token_urlsafe(32)


def hash_refresh_token(token: str) -> str:
    """Băm chuỗi Refresh Token bằng thuật toán SHA-256 trước khi lưu vào database.

    Việc lưu hash của refresh token giúp bảo vệ hệ thống nếu database bị lộ,
    tránh việc kẻ tấn công có thể sử dụng trực tiếp token để lấy access token mới.

    Args:
        token (str): Chuỗi Refresh Token gốc (plain text).

    Returns:
        str: Chuỗi băm SHA-256 dạng hex (độ dài 64 ký tự).
    """
    return hashlib.sha256(token.encode()).hexdigest()
