from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.author import Author
from app.schemas.author import AuthorCreate


async def create_author(db: AsyncSession, author: AuthorCreate):
    db_author = Author(name=author.name, bio=author.bio)
    db.add(db_author)
    await db.commit()
    await db.refresh(db_author)
    return db_author


async def get_authors(db: AsyncSession):
    result = await db.execute(select(Author))
    return result.scalars().all()


async def get_author_by_id(db: AsyncSession, author_id: UUID):
    result = await db.execute(select(Author).filter(Author.id == author_id))
    return result.scalar_one_or_none()


async def update_author(db: AsyncSession, author_id: UUID, author_update: AuthorCreate):
    db_author = await get_author_by_id(db, author_id)
    if not db_author:
        return None

    db_author.name = author_update.name
    db_author.bio = author_update.bio

    await db.commit()
    await db.refresh(db_author)
    return db_author


async def delete_author(db: AsyncSession, author_id: UUID):
    db_author = await get_author_by_id(db, author_id)
    if not db_author:
        return False

    await db.delete(db_author)
    await db.commit()
    return True
