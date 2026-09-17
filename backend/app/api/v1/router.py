from fastapi import APIRouter

# Import tất cả các router con
from app.api.v1.auth.router import router as auth_router
from app.api.v1.borrowing.router import router as borrowing_router
from app.api.v1.uploads.router import router as uploads_router
from app.api.v1.users.router import router as users_router
from app.api.v1.categories import router as categories_router
from app.api.v1.authors import router as authors_router
from app.api.v1.publishers import router as publishers_router
from app.api.v1.books import router as books_router # <-- KHAI BÁO SÁCH Ở ĐÂY

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(borrowing_router)
api_router.include_router(users_router)
api_router.include_router(uploads_router)

api_router.include_router(categories_router, prefix="/categories", tags=["Categories"])
api_router.include_router(authors_router, prefix="/authors", tags=["Authors"])
api_router.include_router(publishers_router, prefix="/publishers", tags=["Publishers"])

api_router.include_router(books_router, prefix="/books", tags=["Books"])