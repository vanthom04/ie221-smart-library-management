"""Exercise real AI API and pgvector indexing with temporary database rows.

Usage: uv run python -m tests.manual_ai_db_check
"""

import asyncio
import uuid
from datetime import UTC, datetime, timedelta

from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_admin
from app.db.session import engine, get_db
from app.main import app
from app.models.author import Author
from app.models.book import Book
from app.models.book_author import BookAuthor
from app.models.borrow_item import BorrowItem
from app.models.borrow_record import BorrowRecord
from app.models.category import Category
from app.models.user import User, UserRole, UserStatus
from app.repositories.ai_search_repository import AISearchRepository


async def main() -> None:
    marker = uuid.uuid4().hex[:12]
    async with engine.connect() as connection:
        outer = await connection.begin()
        try:
            async with AsyncSession(
                bind=connection, join_transaction_mode="create_savepoint", expire_on_commit=False
            ) as session:
                category = Category(name=f"AI DB check {marker}")
                author = Author(name=f"AI DB check author {marker}")
                user = User(
                    full_name="AI DB check reader",
                    email=f"ai-reader-{marker}@example.invalid",
                    hashed_password="test-only-no-login",
                    role=UserRole.USER,
                    status=UserStatus.ACTIVE,
                )
                admin = User(
                    full_name="AI DB check admin",
                    email=f"ai-admin-{marker}@example.invalid",
                    hashed_password="test-only-no-login",
                    role=UserRole.ADMIN,
                    status=UserStatus.ACTIVE,
                )
                session.add_all([category, author, user, admin])
                await session.flush()

                books = [
                    Book(
                        title=f"Lắng nghe và thấu hiểu {marker}",
                        description="Cách trò chuyện, lắng nghe và diễn đạt cảm xúc rõ ràng.",
                        isbn=f"AI-{marker}-1",
                        category_id=category.id,
                        quantity=5,
                        available_quantity=5,
                    ),
                    Book(
                        title=f"Kỹ năng trình bày {marker}",
                        description="Rèn luyện thuyết trình trước đám đông.",
                        isbn=f"AI-{marker}-2",
                        category_id=category.id,
                        quantity=5,
                        available_quantity=5,
                    ),
                    Book(
                        title=f"Những vì sao {marker}",
                        description="Tìm hiểu bầu trời và các chòm sao.",
                        isbn=f"AI-{marker}-3",
                        category_id=category.id,
                        quantity=5,
                        available_quantity=5,
                    ),
                ]
                session.add_all(books)
                await session.flush()
                session.add_all(
                    [BookAuthor(book_id=book.id, author_id=author.id) for book in books]
                )
                await session.commit()

                async def override_db():
                    yield session

                app.dependency_overrides[get_db] = override_db
                app.dependency_overrides[require_admin] = lambda: admin
                app.dependency_overrides[get_current_user] = lambda: user
                repo = AISearchRepository(session)

                async with AsyncClient(
                    transport=ASGITransport(app=app), base_url="http://local.test"
                ) as client:
                    first = await client.post("/api/v1/ai/index-books", json={})
                    assert first.status_code == 200, first.text
                    first_data = first.json()
                    assert first_data["indexed"] >= len(books), first_data
                    print(
                        "first index: "
                        f"checked={first_data['total_checked']} "
                        f"indexed={first_data['indexed']} skipped={first_data['skipped']}"
                    )

                    first_hashes = await repo.get_embedding_hashes()
                    assert all(book.id in first_hashes for book in books)

                    search = await client.post(
                        "/api/v1/ai/search",
                        json={"query": "sách giúp cải thiện kỹ năng giao tiếp", "limit": 20},
                    )
                    assert search.status_code == 200, search.text
                    results = search.json()["results"]
                    matching = next(item for item in results if item["book_id"] == str(books[0].id))
                    assert matching["author"] == author.name
                    assert matching["category"] == category.name
                    print(f"search: {len(results)} results, own book score={matching['score']}")

                    popular = await client.get("/api/v1/ai/recommendations?limit=3")
                    assert popular.status_code == 200, popular.text
                    assert popular.json()["based_on_books"] == 0
                    assert popular.json()["recommendations"]
                    print(f"new-user recommendations: {len(popular.json()['recommendations'])}")

                    now = datetime.now(UTC)
                    history = BorrowRecord(
                        user_id=user.id,
                        borrow_date=now,
                        due_date=now + timedelta(days=14),
                        items=[BorrowItem(book_id=books[0].id, quantity=1)],
                    )
                    session.add(history)
                    await session.commit()
                    personal = await client.get("/api/v1/ai/recommendations?limit=3")
                    assert personal.status_code == 200, personal.text
                    personal_data = personal.json()
                    assert personal_data["based_on_books"] == 1
                    assert personal_data["recommendations"]
                    assert all(
                        item["book_id"] != str(books[0].id)
                        for item in personal_data["recommendations"]
                    )
                    print(
                        f"borrow-history recommendations: {len(personal_data['recommendations'])}"
                    )

                    books[0].description += " Bài tập thực hành đối thoại mỗi ngày."
                    await session.commit()
                    second = await client.post("/api/v1/ai/index-books", json={})
                    assert second.status_code == 200, second.text
                    second_data = second.json()
                    assert second_data["indexed"] == 1, second_data
                    assert second_data["skipped"] == second_data["total_checked"] - 1
                    second_hashes = await repo.get_embedding_hashes()
                    changed = {
                        book_id
                        for book_id, content_hash in second_hashes.items()
                        if first_hashes.get(book_id) != content_hash
                    }
                    assert changed == {books[0].id}, changed
                    print(
                        "after one description edit: "
                        f"checked={second_data['total_checked']} "
                        f"indexed={second_data['indexed']} skipped={second_data['skipped']} "
                        "changed hashes=1"
                    )

                    third = await client.post("/api/v1/ai/index-books", json={})
                    assert third.status_code == 200, third.text
                    third_data = third.json()
                    assert third_data["indexed"] == 0, third_data
                    assert third_data["skipped"] == third_data["total_checked"]
                    assert await repo.get_embedding_hashes() == second_hashes
                    print(
                        "unchanged third index: "
                        f"checked={third_data['total_checked']} "
                        f"indexed={third_data['indexed']} skipped={third_data['skipped']}"
                    )
                    print("PASS: real AI API, embeddings, metadata and content_hash checks")
        finally:
            app.dependency_overrides.clear()
            await outer.rollback()
            await engine.dispose()
            print("Rolled back temporary DB records")


if __name__ == "__main__":
    asyncio.run(main())
