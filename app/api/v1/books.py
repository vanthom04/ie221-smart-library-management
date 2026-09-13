from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import book as schemas
from app.repositories import book as crud
from app.api.deps import get_db

router = APIRouter()

@router.post("/", response_model=schemas.BookResponse)
async def create_book(book: schemas.BookCreate, db: AsyncSession = Depends(get_db)):
    """API thêm mới sách"""
    return await crud.create_book(db=db, book=book)

@router.get("/", response_model=List[schemas.BookResponse])
async def read_books(db: AsyncSession = Depends(get_db)):
    """API lấy danh sách sách"""
    return await crud.get_books(db=db)