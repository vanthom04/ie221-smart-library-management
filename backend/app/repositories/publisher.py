from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.publisher import Publisher
from app.schemas.publisher import PublisherCreate


async def create_publisher(db: AsyncSession, publisher: PublisherCreate):
    db_publisher = Publisher(name=publisher.name, address=publisher.address)
    db.add(db_publisher)
    await db.commit()
    await db.refresh(db_publisher)
    return db_publisher


async def get_publishers(db: AsyncSession):
    result = await db.execute(select(Publisher))
    return result.scalars().all()


async def get_publisher_by_id(db: AsyncSession, publisher_id: UUID):
    result = await db.execute(select(Publisher).filter(Publisher.id == publisher_id))
    return result.scalar_one_or_none()


async def update_publisher(db: AsyncSession, publisher_id: UUID, publisher_update: PublisherCreate):
    db_publisher = await get_publisher_by_id(db, publisher_id)
    if not db_publisher:
        return None
    db_publisher.name = publisher_update.name
    db_publisher.address = publisher_update.address
    await db.commit()
    await db.refresh(db_publisher)
    return db_publisher


async def delete_publisher(db: AsyncSession, publisher_id: UUID):
    db_publisher = await get_publisher_by_id(db, publisher_id)
    if not db_publisher:
        return False
    await db.delete(db_publisher)
    await db.commit()
    return True
