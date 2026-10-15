import asyncio

from app.db.session import AsyncSessionLocal
from app.repositories.refresh_token_repository import RefreshTokenRepository


async def cleanup_refresh_tokens() -> int:
    """Tự mở session vì tác vụ định kỳ chạy ngoài vòng đời request của FastAPI."""
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
