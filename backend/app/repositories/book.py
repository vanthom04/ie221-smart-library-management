from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

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


async def get_book_by_id(db: AsyncSession, book_id: UUID):
    result = await db.execute(select(Book).filter(Book.id == book_id))
    return result.scalar_one_or_none()


async def update_book(db: AsyncSession, book_id: UUID, book_update: BookCreate):
    db_book = await get_book_by_id(db, book_id)
    if not db_book:
        return None

    for key, value in book_update.model_dump().items():
        setattr(db_book, key, value)

    await db.commit()
    await db.refresh(db_book)
    return db_book


async def delete_book(db: AsyncSession, book_id: UUID):
    db_book = await get_book_by_id(db, book_id)
    if not db_book:
        return False
    await db.delete(db_book)
    await db.commit()
    return True


async def search_books(
    db: AsyncSession, title: str | None = None, category_id: UUID | None = None, author_id: UUID | None = None
):
    query = select(Book)

    if title:
        query = query.filter(Book.title.ilike(f"%{title}%"))

    if category_id:
        query = query.filter(Book.category_id == category_id)

    if author_id:
        query = query.filter(Book.author_id == author_id)

    result = await db.execute(query)
    return result.scalars().all()
