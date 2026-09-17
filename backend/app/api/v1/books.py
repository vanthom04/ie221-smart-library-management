from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import DbSession
from app.repositories import book as crud
from app.schemas import book as schemas

router = APIRouter()


@router.post("/", response_model=schemas.BookOut, status_code=status.HTTP_201_CREATED)
async def create_book(book: schemas.BookCreate, db: DbSession):
    return await crud.create_book(db=db, book=book)


@router.get("/", response_model=list[schemas.BookOut])
async def read_books(db: DbSession):
    return await crud.get_books(db=db)


# ================= TÍNH NĂNG TÌM KIẾM CHO ĐỘC GIẢ =================
@router.get("/search", response_model=list[schemas.BookOut])
async def search_books(
    db: DbSession,
    title: str | None = Query(None, description="Tìm theo tên sách (gõ 1 vài chữ)"),
    category_id: UUID | None = Query(None, description="Lọc theo ID thể loại"),
    author_id: UUID | None = Query(None, description="Lọc theo ID tác giả"),
):
    return await crud.search_books(db=db, title=title, category_id=category_id, author_id=author_id)


# ==================================================================


@router.put("/{book_id}", response_model=schemas.BookOut)
async def update_book(book_id: UUID, book: schemas.BookCreate, db: DbSession):
    updated_book = await crud.update_book(db=db, book_id=book_id, book_update=book)
    if not updated_book:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách!")
    return updated_book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: UUID, db: DbSession):
    success = await crud.delete_book(db=db, book_id=book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách để xóa!")
    return None