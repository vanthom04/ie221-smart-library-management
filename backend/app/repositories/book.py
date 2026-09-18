from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.book import Book
from app.models.book_author import BookAuthor
from app.schemas.book import BookCreate


async def create_book(db: AsyncSession, book: BookCreate):
    # Loại bỏ author_id/author_ids để không bị lỗi khi insert vào bảng books
    book_data = book.model_dump(exclude={"author_id", "author_ids"})

    db_book = Book(**book_data)
    db.add(db_book)
    await db.flush()  # Đẩy xuống DB để lấy db_book.id

    # Lưu quan hệ Book <-> Author
    authors = set(book.author_ids)
    if book.author_id:
        authors.add(book.author_id)

    for a_id in authors:
        db.add(BookAuthor(book_id=db_book.id, author_id=a_id))

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

    # Cập nhật thông tin sách
    update_data = book_update.model_dump(exclude={"author_id", "author_ids"})
    for key, value in update_data.items():
        setattr(db_book, key, value)

    # Đồng bộ quan hệ Book <-> Author
    authors = set(book_update.author_ids)
    if book_update.author_id:
        authors.add(book_update.author_id)

    if authors or book_update.author_id is not None or len(book_update.author_ids) > 0:
        # Xóa liên kết cũ
        await db.execute(delete(BookAuthor).where(BookAuthor.book_id == book_id))

        # Thêm liên kết mới
        for a_id in authors:
            db.add(BookAuthor(book_id=book_id, author_id=a_id))

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
    db: AsyncSession,
    title: str | None = None,
    category_id: UUID | None = None,
    author_id: UUID | None = None,
):
    query = select(Book)

    if title:
        query = query.filter(Book.title.ilike(f"%{title}%"))

    if category_id:
        query = query.filter(Book.category_id == category_id)

    if author_id:
        query = query.join(
            BookAuthor,
            BookAuthor.book_id == Book.id,
        ).where(BookAuthor.author_id == author_id)

    result = await db.execute(query)
    return result.scalars().all()
