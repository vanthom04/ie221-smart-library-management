from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import category as schemas
from app.repositories import category as crud
from app.api.deps import get_db

router = APIRouter()

@router.post("/", response_model=schemas.CategoryOut)
async def create_category(category: schemas.CategoryCreate, db: AsyncSession = Depends(get_db)):
    """API thêm mới danh mục"""
    return await crud.create_category(db=db, category=category)

@router.get("/", response_model=List[schemas.CategoryOut])
async def read_categories(db: AsyncSession = Depends(get_db)):
    """API lấy danh sách danh mục"""
    return await crud.get_categories(db=db)