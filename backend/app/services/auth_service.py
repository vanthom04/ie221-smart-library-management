from datetime import UTC, datetime, timedelta

from app.core.config import settings
from app.core.exceptions import EmailAlreadyExistsError, InvalidCredentialsError, InvalidTokenError
from app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from app.models.user import User, UserStatus
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.token import TokenPair


class AuthService:
    """Service xử lý các nghiệp vụ liên quan đến xác thực và tài khoản người dùng.

    Bao gồm các chức năng: Đăng ký, đăng nhập, cấp phát/làm mới token,
    đăng xuất và thay đổi mật khẩu.
    """

    def __init__(
        self, user_repository: UserRepository, refresh_token_repository: RefreshTokenRepository
    ) -> None:
        """Khởi tạo AuthService với các repository cần thiết.

        Args:
            user_repository (UserRepository): Repository thao tác với dữ liệu người dùng.
            refresh_token_repository (RefreshTokenRepository): Repository thao tác với dữ liệu refresh token.
        """  # noqa: E501
        self._users = user_repository
        self._refresh_tokens = refresh_token_repository

    async def register(self, *, full_name: str, email: str, password: str) -> User:
        """Đăng ký tài khoản người dùng mới.

        Kiểm tra xem email đã tồn tại trong hệ thống chưa, nếu chưa thì tiến hành
        băm (hash) mật khẩu và tạo bản ghi người dùng mới vào cơ sở dữ liệu.

        Args:
            full_name (str): Họ và tên của người dùng.
            email (str): Địa chỉ email dùng để đăng nhập.
            password (str): Mật khẩu thô (plain text).

        Returns:
            User: Đối tượng (model) chứa thông tin người dùng vừa được tạo thành công.

        Raises:
            EmailAlreadyExistsError: Khi email đăng ký đã tồn tại trong hệ thống.
        """
        if await self._users.get_by_email(email) is not None:
            raise EmailAlreadyExistsError("Email đã được sử dụng!")

        return await self._users.create(
            full_name=full_name, email=email, hashed_password=hash_password(password)
        )

    async def authenticate(self, *, email: str, password: str) -> User:
        """Xác thực thông tin đăng nhập của người dùng.

        Kiểm tra tính hợp lệ của email, mật khẩu và trạng thái hoạt động
        hiện tại của tài khoản.

        Args:
            email (str): Địa chỉ email đăng nhập.
            password (str): Mật khẩu thô.

        Returns:
            User: Đối tượng (model) chứa thông tin người dùng nếu xác thực thành công.

        Raises:
            InvalidCredentialsError: Khi email/mật khẩu sai hoặc tài khoản đã bị khóa.
        """
        user = await self._users.get_by_email(email)
        if user is None or not verify_password(password, user.hashed_password):
            raise InvalidCredentialsError("Email hoặc mật khẩu không hợp lệ!")

        if user.status != UserStatus.ACTIVE:
            raise InvalidCredentialsError("Tài khoản đã bị khóa!")

        return user

    async def issue_tokens(self, user: User) -> TokenPair:
        """Tạo và cấp phát cặp token (Access Token và Refresh Token) cho người dùng.

        Access token được tạo không cần lưu database. Refresh token được tạo, băm (hash)
        và lưu trữ an toàn vào database để kiểm soát phiên đăng nhập.

        Args:
            user (User): Đối tượng người dùng cần cấp phát token.

        Returns:
            TokenPair: Lược đồ (schema) chứa chuỗi access_token và refresh_token.
        """
        access_token = create_access_token(user.id)
        refresh_token = generate_refresh_token()

        await self._refresh_tokens.create(
            user_id=user.id,
            hashed_token=hash_refresh_token(refresh_token),
            expires_at=datetime.now(UTC) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        return TokenPair(access_token=access_token, refresh_token=refresh_token)

    async def refresh(self, refresh_token: str) -> TokenPair:
        """Cấp lại cặp token mới dựa trên Refresh Token hợp lệ.

        Kiểm tra tính hợp lệ của refresh token, trạng thái tài khoản. Nếu mọi thứ
        đều hợp lệ, token cũ sẽ bị thu hồi (revoke) và cấp lại một cặp token mới
        để xoay vòng (token rotation).

        Args:
            refresh_token (str): Chuỗi refresh token gốc (plain text) từ client.

        Returns:
            TokenPair: Lược đồ chứa cặp access_token và refresh_token mới.

        Raises:
            InvalidTokenError: Khi refresh token không tồn tại, đã hết hạn, hoặc
                tài khoản liên kết đã bị xóa/khóa.
        """
        token_row = await self._refresh_tokens.get_valid_by_hash(hash_refresh_token(refresh_token))
        if token_row is None:
            raise InvalidTokenError("Refresh token không hợp lệ hoặc đã hết hạn!")

        user = await self._users.get_by_id(token_row.user_id)
        if user is None or user.status != UserStatus.ACTIVE:
            raise InvalidTokenError("Tài khoản không tồn tại hoặc đã bị khóa!")

        await self._refresh_tokens.revoke(token_row)
        return await self.issue_tokens(user)

    async def logout(self, refresh_token: str) -> None:
        """Đăng xuất người dùng bằng cách thu hồi (revoke) Refresh Token.

        Tìm kiếm bản hash của refresh token trong database và đánh dấu nó không
        còn hiệu lực. Access token tự động vô hiệu hóa theo thời gian sống (TTL).

        Args:
            refresh_token (str): Chuỗi refresh token hiện hành cần thu hồi.

        Returns:
            None
        """
        token_row = await self._refresh_tokens.get_valid_by_hash(hash_refresh_token(refresh_token))
        if token_row is not None:
            await self._refresh_tokens.revoke(token_row)

    async def change_password(
        self, user: User, *, current_password: str, new_password: str
    ) -> None:
        """Thay đổi mật khẩu của người dùng và đăng xuất khỏi mọi thiết bị khác.

        Xác minh mật khẩu hiện tại, cập nhật mật khẩu mới và tự động thu hồi
        toàn bộ refresh token đang hoạt động của người dùng đó (buộc đăng nhập lại).

        Args:
            user (User): Đối tượng người dùng đang yêu cầu đổi mật khẩu.
            current_password (str): Mật khẩu hiện tại của người dùng.
            new_password (str): Mật khẩu mới muốn thiết lập.

        Returns:
            None

        Raises:
            InvalidCredentialsError: Khi mật khẩu hiện tại cung cấp không chính xác.
        """
        if not verify_password(current_password, user.hashed_password):
            raise InvalidCredentialsError("Mật khẩu hiện tại không đúng!")

        await self._users.update_password(user, hash_password(new_password))
        await self._refresh_tokens.revoke_all_for_user(user.id)
