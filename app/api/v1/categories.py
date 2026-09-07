from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

# Giả định dự án nhóm dùng file deps.py để lấy kết nối DB
from app.api.deps import get_db
from app.schemas import category as schemas
from app.repositories import category as crud

router = APIRouter()

@router.post("/", response_model=schemas.CategoryOut)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    """API thêm mới danh mục"""
    return crud.create_category(db=db, category=category)

@router.get("/", response_model=List[schemas.CategoryOut])
def read_categories(db: Session = Depends(get_db)):
    """API lấy danh sách danh mục"""
    return crud.get_categories(db=db)