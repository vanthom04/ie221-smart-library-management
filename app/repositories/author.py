from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.author import Author
from app.schemas.author import AuthorCreate, AuthorUpdate

async def get_author(db: AsyncSession, author_id: int):
    result = await db.execute(select(Author).filter(Author.id == author_id))
    return result.scalars().first()

async def get_authors(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Author).offset(skip).limit(limit))
    return result.scalars().all()

async def create_author(db: AsyncSession, author: AuthorCreate):
    db_author = Author(name=author.name, bio=author.bio)
    db.add(db_author)
    await db.commit()
    await db.refresh(db_author)
    return db_author

async def update_author(db: AsyncSession, db_author: Author, author_update: AuthorUpdate):
    update_data = author_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_author, key, value)
    db.add(db_author)
    await db.commit()
    await db.refresh(db_author)
    return db_author

async def delete_author(db: AsyncSession, db_author: Author):
    await db.delete(db_author)
    await db.commit()
    return db_author