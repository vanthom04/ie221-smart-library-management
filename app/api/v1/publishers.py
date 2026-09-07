from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas import publisher as schemas
from app.repositories import publisher as crud

router = APIRouter()

@router.post("/", response_model=schemas.PublisherResponse, status_code=status.HTTP_201_CREATED)
async def create_publisher(publisher: schemas.PublisherCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_publisher(db=db, publisher=publisher)

@router.get("/", response_model=List[schemas.PublisherResponse])
async def read_publishers(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.get_publishers(db, skip=skip, limit=limit)

@router.get("/{publisher_id}", response_model=schemas.PublisherResponse)
async def read_publisher(publisher_id: int, db: AsyncSession = Depends(get_db)):
    db_publisher = await crud.get_publisher(db, publisher_id=publisher_id)
    if db_publisher is None:
        raise HTTPException(status_code=404, detail="Publisher not found")
    return db_publisher

@router.put("/{publisher_id}", response_model=schemas.PublisherResponse)
async def update_publisher(publisher_id: int, publisher_in: schemas.PublisherUpdate, db: AsyncSession = Depends(get_db)):
    db_publisher = await crud.get_publisher(db, publisher_id=publisher_id)
    if db_publisher is None:
        raise HTTPException(status_code=404, detail="Publisher not found")
    return await crud.update_publisher(db=db, db_publisher=db_publisher, publisher_update=publisher_in)

@router.delete("/{publisher_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_publisher(publisher_id: int, db: AsyncSession = Depends(get_db)):
    db_publisher = await crud.get_publisher(db, publisher_id=publisher_id)
    if db_publisher is None:
        raise HTTPException(status_code=404, detail="Publisher not found")
    await crud.delete_publisher(db=db, db_publisher=db_publisher)