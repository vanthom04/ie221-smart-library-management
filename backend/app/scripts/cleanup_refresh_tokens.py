"""Script định kỳ dọn dẹp các refresh token đã bị thu hồi hoặc hết hạn.

Script này được thiết kế để chạy độc lập thông qua cron job hoặc lịch trình của hạ tầng,
không phải là một phần của vòng đời request/response trong FastAPI. Do đó, script tự
khởi tạo một cơ chế quản lý session riêng biệt thay vì sử dụng dependency `get_db()`.

Cách chạy thủ công:
    uv run python -m app.scripts.cleanup_refresh_tokens

Cách chạy trong Docker:
    docker compose exec api uv run python -m app.scripts.cleanup_refresh_tokens

Lịch chạy định kỳ (tùy thuộc vào hạ tầng triển khai):
    - Host có crontab: Thêm dòng `0 3 * * * docker compose exec -T api uv run python -m app.scripts.cleanup_refresh_tokens` (chạy vào 3 giờ sáng mỗi ngày).
    - Railway / Render / PaaS: Cấu hình cron job trỏ thẳng tới lệnh chạy script tương ứng.
    - GitHub Actions scheduled workflow: SSH vào server và chạy lệnh thực thi.
"""  # noqa: E501

import asyncio

from app.db.session import AsyncSessionLocal
from app.repositories.refresh_token_repository import RefreshTokenRepository


async def cleanup_refresh_tokens() -> int:
    """Mở một session cơ sở dữ liệu độc lập để xóa các refresh token không còn giá trị.

    Hàm này mở một session riêng biệt (không qua `get_db()` vốn chỉ dùng trong request
    của FastAPI), sau đó gọi repository để xóa toàn bộ các bản ghi refresh token đã bị
    thu hồi (revoked) hoặc đã vượt quá thời gian hết hạn tự nhiên.

    Returns:
        int: Tổng số lượng bản ghi refresh token đã bị xóa khỏi cơ sở dữ liệu.
    """
    async with AsyncSessionLocal() as session:
        repo = RefreshTokenRepository(session)
        return await repo.delete_stale()


async def main() -> None:
    try:
        deleted = await cleanup_refresh_tokens()
        print(f"Da xoa {deleted} refresh_token da revoke/het han")
    except Exception as e:
        print(f"Có lỗi xảy ra: {e}")


if __name__ == "__main__":
    asyncio.run(main())
