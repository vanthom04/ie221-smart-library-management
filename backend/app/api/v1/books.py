from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas import book as schemas
from app.repositories import book as crud
from app.api.deps import get_db

router = APIRouter()

@router.post("/", response_model=schemas.BookOut, status_code=status.HTTP_201_CREATED)
async def create_book(book: schemas.BookCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_book(db=db, book=book)

@router.get("/", response_model=List[schemas.BookOut])
async def read_books(db: AsyncSession = Depends(get_db)):
    return await crud.get_books(db=db)

# ================= TÍNH NĂNG TÌM KIẾM CHO ĐỘC GIẢ =================
@router.get("/search", response_model=List[schemas.BookOut])
async def search_books(
    title: Optional[str] = Query(None, description="Tìm theo tên sách (gõ 1 vài chữ)"),
    category_id: Optional[int] = Query(None, description="Lọc theo ID thể loại"),
    author_id: Optional[int] = Query(None, description="Lọc theo ID tác giả"),
    db: AsyncSession = Depends(get_db)
):
    return await crud.search_books(
        db=db,
        title=title,
        category_id=category_id,
        author_id=author_id
    )
# ==================================================================

@router.put("/{book_id}", response_model=schemas.BookOut)
async def update_book(book_id: int, book: schemas.BookCreate, db: AsyncSession = Depends(get_db)):
    updated_book = await crud.update_book(db=db, book_id=book_id, book_update=book)
    if not updated_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return updated_book

@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int, db: AsyncSession = Depends(get_db)):
    success = await crud.delete_book(db=db, book_id=book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách để xóa!")
    return None