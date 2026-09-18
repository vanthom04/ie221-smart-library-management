from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.book import Book
from app.models.book_author import BookAuthor
from app.schemas.book import BookCreate


async def create_book(db: AsyncSession, book: BookCreate):
    book_data = book.model_dump(exclude={"author_id", "author_ids"})

    db_book = Book(**book_data)
    db.add(db_book)
    await db.flush()

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
    books = result.scalars().all()
    if not books:
        return books

    author_result = await db.execute(
        select(BookAuthor.book_id, BookAuthor.author_id).where(
            BookAuthor.book_id.in_(book.id for book in books)
        )
    )
    authors_by_book = {book.id: [] for book in books}
    for book_id, author_id in author_result.all():
        authors_by_book[book_id].append(author_id)

    for book in books:
        book.author_ids = authors_by_book[book.id]
        book.author_id = book.author_ids[0] if book.author_ids else None

    return books


async def get_book_by_id(db: AsyncSession, book_id: UUID):
    result = await db.execute(select(Book).filter(Book.id == book_id))
    db_book = result.scalar_one_or_none()

    if db_book:
        # Lấy danh sách tác giả để gắn vào BookOut
        author_res = await db.execute(
            select(BookAuthor.author_id).where(BookAuthor.book_id == book_id)
        )
        author_ids = author_res.scalars().all()
        db_book.author_ids = list(author_ids)
        db_book.author_id = author_ids[0] if author_ids else None

    return db_book


async def update_book(db: AsyncSession, book_id: UUID, book_update: BookCreate):
    db_book = await get_book_by_id(db, book_id)
    if not db_book:
        return None

    # Tính toán chênh lệch số lượng để cập nhật đúng available_quantity
    qty_diff = book_update.quantity - db_book.quantity
    new_available_quantity = db_book.available_quantity + qty_diff

    if new_available_quantity < 0:
        raise ValueError("Số lượng sách tổng không thể nhỏ hơn số sách đang được mượn")

    update_data = book_update.model_dump(exclude={"author_id", "author_ids", "available_quantity"})

    for key, value in update_data.items():
        setattr(db_book, key, value)

    db_book.available_quantity = new_available_quantity

    authors = set(book_update.author_ids)
    if book_update.author_id:
        authors.add(book_update.author_id)

    if authors or book_update.author_id is not None or len(book_update.author_ids) > 0:
        await db.execute(delete(BookAuthor).where(BookAuthor.book_id == book_id))
        for a_id in authors:
            db.add(BookAuthor(book_id=book_id, author_id=a_id))

    await db.commit()
    await db.refresh(db_book)
    return db_book


async def delete_book(db: AsyncSession, book_id: UUID):
    db_book = await get_book_by_id(db, book_id)
    if not db_book:
        return False

    try:
        await db.delete(db_book)
        await db.commit()
        return True
    except IntegrityError as e:  # THÊM as e Ở ĐÂY
        await db.rollback()
        # THÊM from e Ở ĐÂY
        raise ValueError("Không thể xóa sách do đang tồn tại lịch sử mượn trả") from e


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
