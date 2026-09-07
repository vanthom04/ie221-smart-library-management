import uuid
from datetime import UTC, datetime

from sqlalchemy import delete, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    """Kho lưu trữ (Repository) xử lý các thao tác cơ sở dữ liệu cho bảng RefreshToken.

    Cung cấp các phương thức để tạo mới, truy vấn token hợp lệ và thu hồi (revoke)
    refresh token của người dùng.
    """

    def __init__(self, session: AsyncSession) -> None:
        """Khởi tạo RefreshTokenRepository với một phiên làm việc cơ sở dữ liệu.

        Args:
            session (AsyncSession): Phiên làm việc (session) bất đồng bộ của SQLAlchemy
                để giao tiếp với cơ sở dữ liệu.
        """
        self._session = session

    async def create(
        self, *, user_id: uuid.UUID, hashed_token: str, expires_at: datetime
    ) -> RefreshToken:
        """Tạo mới một bản ghi refresh token vào cơ sở dữ liệu.

        Args:
            user_id (uuid.UUID): ID định danh của người dùng sở hữu token.
            hashed_token (str): Chuỗi refresh token đã được băm (hash) để lưu trữ an toàn.
            expires_at (datetime): Thời điểm (UTC) mà refresh token này hết hạn.

        Returns:
            RefreshToken: Đối tượng token vừa được lưu vào cơ sở dữ liệu.
        """
        token = RefreshToken(user_id=user_id, hashed_token=hashed_token, expires_at=expires_at)
        self._session.add(token)
        await self._session.commit()
        await self._session.refresh(token)
        return token

    async def get_valid_by_hash(self, hashed_token: str) -> RefreshToken | None:
        """Lấy thông tin một refresh token hợp lệ dựa trên chuỗi băm.

        Chỉ trả về token nếu nó đáp ứng đủ các điều kiện:
        chưa bị thu hồi (revoked == False) và chưa quá hạn sử dụng (expires_at > now).

        Args:
            hashed_token (str): Chuỗi băm của refresh token cần kiểm tra.

        Returns:
            RefreshToken | None: Đối tượng token nếu tìm thấy và hoàn toàn hợp lệ,
                ngược lại trả về None.
        """
        result = await self._session.execute(
            select(RefreshToken).where(
                RefreshToken.hashed_token == hashed_token,
                RefreshToken.revoked.is_(False),
                RefreshToken.expires_at > datetime.now(UTC),
            )
        )
        return result.scalar_one_or_none()

    async def revoke(self, token: RefreshToken) -> None:
        """Thu hồi (vô hiệu hóa) một refresh token cụ thể.

        Đánh dấu trường `revoked` của token thành True, khiến nó không thể
        được sử dụng để cấp lại access token nữa.

        Args:
            token (RefreshToken): Đối tượng refresh token cần bị thu hồi.

        Returns:
            None
        """
        token.revoked = True
        await self._session.commit()

    async def rotate(self, token: RefreshToken, *, hashed_token: str, expires_at: datetime) -> None:
        """Cập nhật thay thế (rotate) token hiện có bằng cách ghi đè trực tiếp (UPDATE) thay vì tạo mới.

        Giữ nguyên tính năng bảo mật của token rotation: token cũ nếu bị tái sử dụng
        sẽ không tìm thấy chuỗi hash trong database nữa (do đã bị ghi đè) và thất bại
        giống như khi revoke. Đồng thời, cách này giúp tránh sinh thêm bản ghi mới
        khi có nhiều request refresh liên tục (ví dụ: người dùng nhấn F5), hạn chế tình
        trạng phình to cơ sở dữ liệu vô ích.

        Args:
            token (RefreshToken): Đối tượng refresh token hiện tại cần thực hiện rotate.
            hashed_token (str): Chuỗi băm của refresh token mới.
            expires_at (datetime): Thời điểm (UTC) hết hạn của refresh token mới.

        Returns:
            None
        """  # noqa: E501
        token.hashed_token = hashed_token
        token.expires_at = expires_at
        await self._session.commit()

    async def revoke_all_for_user(self, user_id: uuid.UUID) -> None:
        """Thu hồi toàn bộ refresh token của một người dùng cụ thể.

        Thường được sử dụng trong các nghiệp vụ nhạy cảm như khi người dùng
        đổi mật khẩu hoặc khi admin khóa tài khoản. Thao tác này sẽ buộc người dùng
        phải đăng xuất khỏi mọi thiết bị / phiên đăng nhập hiện tại do không thể
        dùng refresh token cũ để lấy access token mới.

        Args:
            user_id (uuid.UUID): ID định danh của người dùng cần thu hồi toàn bộ token.

        Returns:
            None
        """
        await self._session.execute(
            update(RefreshToken).where(RefreshToken.user_id == user_id).values(revoked=True)
        )
        await self._session.commit()

    async def delete_stale(self) -> int:
        """Xóa vĩnh viễn các bản ghi refresh token đã không còn giá trị sử dụng.

        Bao gồm các token đã bị thu hồi (`revoked` do đăng xuất, đổi mật khẩu, hoặc
        bị admin khóa tài khoản) hoặc các token đã tự động hết hạn tự nhiên.
        Phương thức này được thiết kế để chạy định kỳ thông qua script/cron job bên ngoài
        (ví dụ: `app/scripts/cleanup_refresh_tokens.py`), tuyệt đối không gọi trực tiếp
        trong các request xử lý nghiệp vụ thông thường.

        Returns:
            int: Số lượng bản ghi đã được xóa khỏi cơ sở dữ liệu.
        """
        result = await self._session.execute(
            delete(RefreshToken).where(
                or_(RefreshToken.revoked.is_(True), RefreshToken.expires_at < datetime.now(UTC))
            )
        )
        await self._session.commit()
        return result.rowcount  # type: ignore
