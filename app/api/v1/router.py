from app.api.v1 import authors
from fastapi import APIRouter
from app.api.v1 import categories
from app.api.v1 import publishers, books
api_router = APIRouter()

# Đưa router của Category vào hệ thống API
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(authors.router, prefix="/authors", tags=["Authors"])
api_router.include_router(publishers.router, prefix="/publishers", tags=["Publishers"])
api_router.include_router(books.router, prefix="/books", tags=["Books"])