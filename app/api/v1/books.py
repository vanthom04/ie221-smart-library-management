from typing import List
from fastapi import APIRouter, Depends, HTTPException
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

@router.get("/search", response_model=List[schemas.BookResponse])
async def search_books_api(keyword: str, db: AsyncSession = Depends(get_db)):
    """API tìm kiếm sách theo từ khóa (Tiêu đề hoặc Mô tả)"""
    return await crud.search_books(db=db, keyword=keyword)

# ========================================================
# THÊM API CHI TIẾT SÁCH VÀO DƯỚI CÙNG (Dưới hàm search)
# ========================================================
@router.get("/{book_id}", response_model=schemas.BookResponse)
async def get_book_api(book_id: int, db: AsyncSession = Depends(get_db)):
    """API lấy thông tin chi tiết 1 cuốn sách theo ID"""
    book = await crud.get_book_by_id(db=db, book_id=book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách")
    return book