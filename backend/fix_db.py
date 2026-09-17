import asyncio

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Trỏ trực tiếp vào Neon Database từ file .env của nhóm
db_url = "postgresql+asyncpg://neondb_owner:npg_dNR7YMs5GyXr@ep-tiny-frog-azp4ueom-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?ssl=require"


async def reset_db():
    print("⏳ Đang dọn dẹp các bảng bị sai cấu trúc trên Neon Database...")
    engine = create_async_engine(db_url)
    async with engine.begin() as conn:
        # Xóa sạch cấu trúc cũ và tạo lại schema mới tinh
        await conn.execute(text("DROP SCHEMA public CASCADE;"))
        await conn.execute(text("CREATE SCHEMA public;"))
    print("✅ Đã dọn sạch! Database giờ là trang giấy trắng sẵn sàng nhận cấu trúc mới.")


if __name__ == "__main__":
    asyncio.run(reset_db())
