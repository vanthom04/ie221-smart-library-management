from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas import book as schemas
from app.repositories import book as crud

router = APIRouter()

@router.post("/", response_model=schemas.BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(book: schemas.BookCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_book(db=db, book=book)

# SEARCH API: Đặt lên trước {book_id}
@router.get("/search", response_model=List[schemas.BookResponse])
async def search_books(q: str, db: AsyncSession = Depends(get_db)):
    """
    Tìm kiếm sách theo tiêu đề.
    Sau này nhóm có thể tích hợp DeepSeek/OpenAI tại đây để xử lý AI Recommendation.
    """
    return await crud.search_books(db, keyword=q)

@router.get("/", response_model=List[schemas.BookResponse])
async def read_books(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await crud.get_books(db, skip=skip, limit=limit)

@router.get("/{book_id}", response_model=schemas.BookResponse)
async def read_book(book_id: int, db: AsyncSession = Depends(get_db)):
    db_book = await crud.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return db_book

@router.put("/{book_id}", response_model=schemas.BookResponse)
async def update_book(book_id: int, book_in: schemas.BookUpdate, db: AsyncSession = Depends(get_db)):
    db_book = await crud.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return await crud.update_book(db=db, db_book=db_book, book_update=book_in)

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int, db: AsyncSession = Depends(get_db)):
    db_book = await crud.get_book(db, book_id=book_id)
    if db_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    await crud.delete_book(db=db, db_book=db_book)