from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import category as schemas
from app.repositories import category as crud
from app.api.deps import get_db

router = APIRouter()

@router.post("/", response_model=schemas.CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(category: schemas.CategoryCreate, db: AsyncSession = Depends(get_db)):
    """API thêm mới danh mục"""
    return await crud.create_category(db=db, category=category)

@router.get("/", response_model=List[schemas.CategoryOut])
async def read_categories(db: AsyncSession = Depends(get_db)):
    """API lấy danh sách danh mục"""
    return await crud.get_categories(db=db)

@router.put("/{category_id}", response_model=schemas.CategoryOut)
async def update_category(category_id: int, category: schemas.CategoryCreate, db: AsyncSession = Depends(get_db)):
    """API cập nhật danh mục"""
    updated_category = await crud.update_category(db=db, category_id=category_id, category_update=category)
    if not updated_category:
        raise HTTPException(status_code=404, detail="Không tìm thấy thể loại để sửa!")
    return updated_category

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db)):
    """API xóa danh mục"""
    success = await crud.delete_category(db=db, category_id=category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy thể loại để xóa!")
    return None