from uuid import UUID  # <-- Thêm dòng này

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.repositories import category as crud
from app.schemas import category as schemas

router = APIRouter()


@router.post("/", response_model=schemas.CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(category: schemas.CategoryCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_category(db=db, category=category)


@router.get("/", response_model=list[schemas.CategoryOut])
async def read_categories(db: AsyncSession = Depends(get_db)):
    return await crud.get_categories(db=db)


@router.put("/{category_id}", response_model=schemas.CategoryOut)
async def update_category(
    category_id: UUID, category: schemas.CategoryCreate, db: AsyncSession = Depends(get_db)
):  # <-- Đã đổi thành UUID
    updated_category = await crud.update_category(db=db, category_id=category_id, category_update=category)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Không tìm thấy thể loại để sửa!")
    return updated_category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: UUID, db: AsyncSession = Depends(get_db)):  # <-- Đã đổi thành UUID
    success = await crud.delete_category(db=db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy thể loại để xóa!")
    return None
