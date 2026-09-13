from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.book import Book
from app.schemas.book import BookCreate

async def create_book(db: AsyncSession, book: BookCreate):
    # Sử dụng model_dump() để giải nén toàn bộ dữ liệu (title, category_id,...)
    db_book = Book(**book.model_dump())
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def get_books(db: AsyncSession):
    result = await db.execute(select(Book))
    return result.scalars().all()

# THÊM HÀM NÀY ĐỂ TRUY VẤN CHI TIẾT 1 CUỐN SÁCH:
async def get_book_by_id(db: AsyncSession, book_id: int):
    query = select(Book).where(Book.id == book_id)
    result = await db.execute(query)
    return result.scalars().first()

async def search_books(db: AsyncSession, keyword: str):
    query = select(Book).where(
        or_(
            Book.title.ilike(f"%{keyword}%"),
            Book.description.ilike(f"%{keyword}%")
        )
    )
    result = await db.execute(query)
    return result.scalars().all()