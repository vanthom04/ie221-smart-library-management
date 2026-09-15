from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.book import Book
from app.schemas.book import BookCreate


async def create_book(db: AsyncSession, book: BookCreate):
    db_book = Book(**book.model_dump())
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book


async def get_books(db: AsyncSession):
    result = await db.execute(select(Book))
    return result.scalars().all()


async def get_book_by_id(db: AsyncSession, book_id: int):
    result = await db.execute(select(Book).filter(Book.id == book_id))
    return result.scalar_one_or_none()


async def update_book(db: AsyncSession, book_id: int, book_update: BookCreate):
    db_book = await get_book_by_id(db, book_id)
    if not db_book:
        return None

    for key, value in book_update.model_dump().items():
        setattr(db_book, key, value)

    await db.commit()
    await db.refresh(db_book)
    return db_book


async def delete_book(db: AsyncSession, book_id: int):
    db_book = await get_book_by_id(db, book_id)
    if not db_book:
        return False
    await db.delete(db_book)
    await db.commit()
    return True