from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.schemas.category import CategoryCreate


async def create_category(db: AsyncSession, category: CategoryCreate):
    db_category = Category(name=category.name, description=category.description)
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category


async def get_categories(db: AsyncSession):
    # Trong môi trường bất đồng bộ, ta dùng db.execute(select(...)) thay vì db.query(...)
    result = await db.execute(select(Category))
    return result.scalars().all()


async def get_category_by_id(db: AsyncSession, category_id: UUID):
    """Hàm phụ trợ để tìm thể loại theo ID"""
    result = await db.execute(select(Category).filter(Category.id == category_id))
    return result.scalar_one_or_none()


async def update_category(db: AsyncSession, category_id: UUID, category_update: CategoryCreate):
    """Xử lý cập nhật thể loại"""
    db_category = await get_category_by_id(db, category_id)
    if not db_category:
        return None

    # Cập nhật thông tin mới
    db_category.name = category_update.name
    db_category.description = category_update.description

    await db.commit()
    await db.refresh(db_category)
    return db_category


async def delete_category(db: AsyncSession, category_id: UUID):
    """Xử lý xóa thể loại"""
    db_category = await get_category_by_id(db, category_id)
    if not db_category:
        return False

    try:
        await db.delete(db_category)
        await db.commit()
        return True
    except IntegrityError as exc:
        await db.rollback()
        raise ValueError("Không thể xóa thể loại vì đang có sách thuộc thể loại này") from exc
