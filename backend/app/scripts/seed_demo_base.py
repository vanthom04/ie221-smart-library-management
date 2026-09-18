"""Seed master data và tài khoản phục vụ demo.

Chạy:
    uv run python -m app.scripts.seed_demo_base
"""

from __future__ import annotations

import asyncio

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.db.session import AsyncSessionLocal
from app.models.author import Author
from app.models.book import Book
from app.models.book_author import BookAuthor
from app.models.category import Category
from app.models.publisher import Publisher
from app.models.user import User, UserRole, UserStatus
from app.scripts.demo_seed_data import (
    AUTHORS,
    BOOKS,
    CATEGORIES,
    DEMO_DEFAULT_PASSWORD,
    DEMO_USERS,
    PUBLISHERS,
    ensure_demo_seed_allowed,
)


async def get_or_create_category(session: AsyncSession, data: dict) -> Category:
    category = (
        await session.execute(select(Category).where(Category.name == data["name"]))
    ).scalar_one_or_none()
    if category is None:
        category = Category(**data)
        session.add(category)
        await session.flush()
    else:
        category.description = data["description"]
    return category


async def get_or_create_publisher(session: AsyncSession, data: dict) -> Publisher:
    publisher = (
        (await session.execute(select(Publisher).where(Publisher.name == data["name"])))
        .scalars()
        .first()
    )
    if publisher is None:
        publisher = Publisher(**data)
        session.add(publisher)
        await session.flush()
    else:
        publisher.address = data["address"]
    return publisher


async def get_or_create_author(session: AsyncSession, data: dict) -> Author:
    author = (
        (await session.execute(select(Author).where(Author.name == data["name"]))).scalars().first()
    )
    if author is None:
        author = Author(**data)
        session.add(author)
        await session.flush()
    else:
        author.bio = data["bio"]
    return author


async def upsert_demo_users(session: AsyncSession) -> dict[str, User]:
    users: dict[str, User] = {}
    for data in DEMO_USERS:
        user = (
            await session.execute(select(User).where(User.email == data["email"]))
        ).scalar_one_or_none()
        role = UserRole.ADMIN if data["role"] == "admin" else UserRole.USER
        if user is None:
            user = User(
                full_name=data["full_name"],
                email=data["email"],
                hashed_password=hash_password(DEMO_DEFAULT_PASSWORD),
                role=role,
                status=UserStatus.ACTIVE,
            )
            session.add(user)
            await session.flush()
        else:
            user.full_name = data["full_name"]
            user.role = role
            user.status = UserStatus.ACTIVE
            user.hashed_password = hash_password(DEMO_DEFAULT_PASSWORD)
        users[data["email"]] = user
    return users


async def upsert_demo_books(
    session: AsyncSession,
    categories: dict[str, Category],
    publishers: dict[str, Publisher],
    authors: dict[str, Author],
) -> dict[str, Book]:
    books: dict[str, Book] = {}
    for data in BOOKS:
        book = (
            await session.execute(select(Book).where(Book.isbn == data["isbn"]))
        ).scalar_one_or_none()
        quantity = data["quantity"]
        if book is None:
            book = Book(
                title=data["title"],
                isbn=data["isbn"],
                description=data["description"],
                category_id=categories[data["category"]].id,
                publisher_id=publishers[data["publisher"]].id,
                quantity=quantity,
                available_quantity=quantity,
                published_year=data["published_year"],
                cover_image_url=data["cover_image_url"],
            )
            session.add(book)
            await session.flush()
        else:
            book.title = data["title"]
            book.description = data["description"]
            book.category_id = categories[data["category"]].id
            book.publisher_id = publishers[data["publisher"]].id
            book.quantity = quantity
            book.available_quantity = min(book.available_quantity, quantity)
            book.published_year = data["published_year"]
            book.cover_image_url = data["cover_image_url"]

        await session.execute(delete(BookAuthor).where(BookAuthor.book_id == book.id))
        for author_name in data["authors"]:
            session.add(BookAuthor(book_id=book.id, author_id=authors[author_name].id))
        books[data["isbn"]] = book

    await session.flush()
    return books


async def seed_demo_base() -> None:
    ensure_demo_seed_allowed()
    async with AsyncSessionLocal() as session:
        try:
            categories = {
                data["name"]: await get_or_create_category(session, data) for data in CATEGORIES
            }
            publishers = {
                data["name"]: await get_or_create_publisher(session, data) for data in PUBLISHERS
            }
            authors = {data["name"]: await get_or_create_author(session, data) for data in AUTHORS}
            await upsert_demo_users(session)
            books = await upsert_demo_books(session, categories, publishers, authors)
            await session.commit()

            print("Seed master data hoàn tất")
            print(f"- Categories: {len(categories)}")
            print(f"- Publishers: {len(publishers)}")
            print(f"- Authors: {len(authors)}")
            print(f"- Books: {len(books)}")
            print(f"- Demo users: {len(DEMO_USERS)}")
            print(f"- Demo password: {DEMO_DEFAULT_PASSWORD}")
        except Exception:
            await session.rollback()
            raise


async def main() -> None:
    await seed_demo_base()


if __name__ == "__main__":
    asyncio.run(main())
