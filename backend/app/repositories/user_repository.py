import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserStatus


class UserRepository:
    """Kho lưu trữ (Repository) xử lý các thao tác cơ sở dữ liệu cho bảng User.

    Lớp này đóng gói các câu truy vấn SQLAlchemy (ẩn đi chi tiết về ORM)
    để thực hiện các thao tác CRUD (Tạo, Đọc, Cập nhật) đối với thực thể User.
    """

    def __init__(self, session: AsyncSession) -> None:
        """Khởi tạo UserRepository với một phiên làm việc cơ sở dữ liệu.

        Args:
            session (AsyncSession): Phiên làm việc (session) bất đồng bộ của SQLAlchemy
                để giao tiếp với cơ sở dữ liệu.
        """
        self._session = session

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        """Truy vấn thông tin người dùng theo khóa chính (ID).

        Args:
            user_id (uuid.UUID): ID định danh (UUID) của người dùng cần tìm.

        Returns:
            User | None: Trả về đối tượng người dùng (User) nếu tìm thấy,
                ngược lại trả về None.
        """
        return await self._session.get(User, user_id)

    async def get_by_email(self, email: str) -> User | None:
        """Truy vấn thông tin người dùng theo địa chỉ email.

        Args:
            email (str): Địa chỉ email của người dùng cần tìm.

        Returns:
            User | None: Trả về đối tượng người dùng (User) nếu tìm thấy
                chính xác khớp với email, ngược lại trả về None.
        """
        result = await self._session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, *, full_name: str, email: str, hashed_password: str) -> User:
        """Tạo mới một bản ghi người dùng vào cơ sở dữ liệu.

        Khởi tạo đối tượng User, thêm vào session, thực hiện commit để lưu
        vào database và sau đó refresh để cập nhật lại các trường tự sinh (như id).

        Args:
            full_name (str): Họ và tên của người dùng.
            email (str): Địa chỉ email (được dùng làm tài khoản đăng nhập).
            hashed_password (str): Chuỗi mật khẩu đã được băm an toàn.

        Returns:
            User: Đối tượng người dùng vừa được tạo và lưu thành công (đã bao gồm ID).
        """
        user = User(full_name=full_name, email=email, hashed_password=hashed_password)
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def update_password(self, user: User, hashed_password: str) -> User:
        """Cập nhật mật khẩu mới cho người dùng.

        Args:
            user (User): Đối tượng người dùng hiện tại đang cần đổi mật khẩu.
            hashed_password (str): Chuỗi mật khẩu mới đã được băm.

        Returns:
            User: Đối tượng người dùng sau khi đã cập nhật mật khẩu thành công.
        """
        user.hashed_password = hashed_password
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def update_status(self, user: User, status: UserStatus) -> User:
        """Cập nhật trạng thái hoạt động của người dùng.

        Thường được dùng để khóa (LOCKED) hoặc mở khóa (ACTIVE) một tài khoản.

        Args:
            user (User): Đối tượng người dùng cần thay đổi trạng thái.
            status (UserStatus): Enum trạng thái mới cần thiết lập.

        Returns:
            User: Đối tượng người dùng sau khi đã cập nhật trạng thái thành công.
        """
        user.status = status
        await self._session.commit()
        await self._session.refresh(user)
        return user
