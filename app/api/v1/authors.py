from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas import author as schemas
from app.repositories import author as crud

router = APIRouter()

@router.post("/", response_model=schemas.AuthorResponse, status_code=status.HTTP_201_CREATED)
async def create_author(author: schemas.AuthorCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_author(db=db, author=author)

@router.get("/", response_model=List[schemas.AuthorResponse])
async def read_authors(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    authors = await crud.get_authors(db, skip=skip, limit=limit)
    return authors

@router.get("/{author_id}", response_model=schemas.AuthorResponse)
async def read_author(author_id: int, db: AsyncSession = Depends(get_db)):
    db_author = await crud.get_author(db, author_id=author_id)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    return db_author

@router.put("/{author_id}", response_model=schemas.AuthorResponse)
async def update_author(author_id: int, author_in: schemas.AuthorUpdate, db: AsyncSession = Depends(get_db)):
    db_author = await crud.get_author(db, author_id=author_id)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    return await crud.update_author(db=db, db_author=db_author, author_update=author_in)

@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_author(author_id: int, db: AsyncSession = Depends(get_db)):
    db_author = await crud.get_author(db, author_id=author_id)
    if db_author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    await crud.delete_author(db=db, db_author=db_author)