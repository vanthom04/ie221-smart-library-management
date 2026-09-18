from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from app.api.deps import DbSession, RequireAdmin
from app.repositories import author as crud
from app.schemas import author as schemas

router = APIRouter()


@router.post("/", response_model=schemas.AuthorOut, status_code=status.HTTP_201_CREATED)
async def create_author(author: schemas.AuthorCreate, db: DbSession, _: RequireAdmin):
    return await crud.create_author(db=db, author=author)


@router.get("/", response_model=list[schemas.AuthorOut])
async def read_authors(db: DbSession):
    return await crud.get_authors(db=db)


@router.put("/{author_id}", response_model=schemas.AuthorOut)
async def update_author(
    author_id: UUID, author: schemas.AuthorCreate, db: DbSession, _: RequireAdmin
):
    updated_author = await crud.update_author(db=db, author_id=author_id, author_update=author)
    if not updated_author:
        raise HTTPException(status_code=404, detail="Không tìm thấy tác giả để sửa!")
    return updated_author


@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_author(author_id: UUID, db: DbSession, _: RequireAdmin):
    success = await crud.delete_author(db=db, author_id=author_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy tác giả để xóa!")
    return None
