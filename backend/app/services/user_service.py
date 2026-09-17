import uuid

from app.core.exceptions import UserNotFoundError
from app.models.user import User, UserStatus
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository


class UserService:
    """Service xử lý các nghiệp vụ quản lý tài khoản người dùng.

    Cung cấp các chức năng liên quan đến thay đổi trạng thái tài khoản
    như khóa (lock) và mở khóa (unlock) người dùng.
    """

    def __init__(
        self, user_repository: UserRepository, refresh_token_repository: RefreshTokenRepository
    ) -> None:
        """Khởi tạo UserService với các repository cần thiết.

        Args:
            user_repository (UserRepository): Repository thao tác với dữ liệu người dùng.
            refresh_token_repository (RefreshTokenRepository): Repository thao tác với dữ liệu refresh token.
        """  # noqa: E501
        self._users = user_repository
        self._refresh_tokens = refresh_token_repository

    async def lock(self, user_id: uuid.UUID) -> User:
        """Khóa tài khoản người dùng và vô hiệu hóa các phiên đăng nhập hiện tại.

        Cập nhật trạng thái người dùng thành `LOCKED` và thu hồi toàn bộ
        refresh token. Lưu ý: Do Access Token (JWT) có tính chất phi trạng thái
        (stateless), nó sẽ không bị thu hồi ngay lập tức mà vẫn còn hiệu lực cho
        đến khi tự hết hạn (cấu hình qua ACCESS_TOKEN_EXPIRE_MINUTES). Người dùng
        sẽ không thể dùng refresh token để lấy access token mới sau khi bị khóa.

        Args:
            user_id (uuid.UUID): ID định danh của người dùng cần khóa.

        Returns:
            User: Đối tượng (model) người dùng sau khi đã cập nhật trạng thái.

        Raises:
            UserNotFoundError: Khi không tìm thấy người dùng mang ID này trong hệ thống.
        """
        user = await self._get_or_raise(user_id)
        user = await self._users.update_status(user, UserStatus.LOCKED)
        await self._refresh_tokens.revoke_all_for_user(user.id)
        return user

    async def unlock(self, user_id: uuid.UUID) -> User:
        """Mở khóa tài khoản người dùng.

        Cập nhật trạng thái người dùng thành `ACTIVE`, cho phép họ thực hiện
        các thao tác đăng nhập và lấy token bình thường trở lại.

        Args:
            user_id (uuid.UUID): ID định danh của người dùng cần mở khóa.

        Returns:
            User: Đối tượng (model) người dùng sau khi đã cập nhật trạng thái.

        Raises:
            UserNotFoundError: Khi không tìm thấy người dùng mang ID này trong hệ thống.
        """
        user = await self._get_or_raise(user_id)
        return await self._users.update_status(user, UserStatus.ACTIVE)

    async def _get_or_raise(self, user_id: uuid.UUID) -> User:
        """Kiểm tra và lấy thông tin người dùng từ cơ sở dữ liệu.

        Đây là hàm nội bộ (private method) dùng để tái sử dụng logic kiểm tra
        sự tồn tại của người dùng trước khi thực hiện các thao tác khác.

        Args:
            user_id (uuid.UUID): ID định danh của người dùng cần lấy thông tin.

        Returns:
            User: Đối tượng (model) chứa thông tin người dùng nếu tồn tại.

        Raises:
            UserNotFoundError: Khi truy vấn cơ sở dữ liệu không trả về kết quả.
        """
        user = await self._users.get_by_id(user_id)
        if user is None:
            raise UserNotFoundError("Không tìm thấy người dùng!")
        return user
