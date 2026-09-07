from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate

async def get_book(db: AsyncSession, book_id: int):
    result = await db.execute(select(Book).filter(Book.id == book_id))
    return result.scalars().first()

async def get_books(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Book).offset(skip).limit(limit))
    return result.scalars().all()

# API Tìm kiếm theo từ khóa (Có thể mở rộng gọi AI ở tầng Service sau)
async def search_books(db: AsyncSession, keyword: str):
    # Tìm kiếm tương đối (LIKE) không phân biệt hoa thường
    query = select(Book).filter(Book.title.ilike(f"%{keyword}%"))
    result = await db.execute(query)
    return result.scalars().all()

async def create_book(db: AsyncSession, book: BookCreate):
    db_book = Book(**book.model_dump())
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def update_book(db: AsyncSession, db_book: Book, book_update: BookUpdate):
    update_data = book_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_book, key, value)
    db.add(db_book)
    await db.commit()
    await db.refresh(db_book)
    return db_book

async def delete_book(db: AsyncSession, db_book: Book):
    await db.delete(db_book)
    await db.commit()
    return db_book