from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.publisher import Publisher
from app.schemas.publisher import PublisherCreate, PublisherUpdate

async def get_publisher(db: AsyncSession, publisher_id: int):
    result = await db.execute(select(Publisher).filter(Publisher.id == publisher_id))
    return result.scalars().first()

async def get_publishers(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Publisher).offset(skip).limit(limit))
    return result.scalars().all()

async def create_publisher(db: AsyncSession, publisher: PublisherCreate):
    db_publisher = Publisher(name=publisher.name, address=publisher.address)
    db.add(db_publisher)
    await db.commit()
    await db.refresh(db_publisher)
    return db_publisher

async def update_publisher(db: AsyncSession, db_publisher: Publisher, publisher_update: PublisherUpdate):
    update_data = publisher_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_publisher, key, value)
    db.add(db_publisher)
    await db.commit()
    await db.refresh(db_publisher)
    return db_publisher

async def delete_publisher(db: AsyncSession, db_publisher: Publisher):
    await db.delete(db_publisher)
    await db.commit()
    return db_publisher