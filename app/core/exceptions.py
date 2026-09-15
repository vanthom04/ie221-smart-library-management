class DomainError(Exception):
    """Base exception cho toàn bộ business logic."""

    status_code: int = 400
    headers: dict[str, str] | None = None

    def __init__(self, detail: str) -> None:
        self.detail = detail
        super().__init__(detail)


class EmailAlreadyExistsError(DomainError):
    """Email đã được sử dụng."""

    status_code = 409


class InvalidCredentialsError(DomainError):
    """Sai email/mật khẩu, hoặc tài khoản bị vô hiệu hóa."""

    status_code = 401
    headers = {"WWW-Authenticate": "Bearer"}


class InvalidTokenError(DomainError):
    """Access/refresh token không hợp lệ, sai loại token hoặc hết hạn."""

    status_code = 401
    headers = {"WWW-Authenticate": "Bearer"}


class UserNotFoundError(DomainError):
    """Không tìm thấy user hoặc user không tồn tại."""

    status_code = 404


class InsufficientPermissionError(DomainError):
    """User đã xác thực hợp lệ nhưng không đủ quyền."""

    status_code = 403


class FileTooLargeError(DomainError):
    """Dung lượng file quá lớn."""

    status_code = 413


class UnsupportedFileTypeError(DomainError):
    """Định dạng file không hỗ trợ."""

    status_code = 415
