from uuid import UUID  # <-- Thêm dòng này

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.repositories import publisher as crud
from app.schemas import publisher as schemas

router = APIRouter()


@router.post("/", response_model=schemas.PublisherOut, status_code=status.HTTP_201_CREATED)
async def create_publisher(publisher: schemas.PublisherCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_publisher(db=db, publisher=publisher)


@router.get("/", response_model=list[schemas.PublisherOut])
async def read_publishers(db: AsyncSession = Depends(get_db)):
    return await crud.get_publishers(db=db)


@router.put("/{publisher_id}", response_model=schemas.PublisherOut)
async def update_publisher(
    publisher_id: UUID, publisher: schemas.PublisherCreate, db: AsyncSession = Depends(get_db)
):  # <-- Đã đổi thành UUID
    updated_publisher = await crud.update_publisher(db=db, publisher_id=publisher_id, publisher_update=publisher)
    if not updated_publisher:
        raise HTTPException(status_code=404, detail="Không tìm thấy NXB để sửa!")
    return updated_publisher


@router.delete("/{publisher_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_publisher(publisher_id: UUID, db: AsyncSession = Depends(get_db)):  # <-- Đã đổi thành UUID
    success = await crud.delete_publisher(db=db, publisher_id=publisher_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy NXB để xóa!")
    return None
