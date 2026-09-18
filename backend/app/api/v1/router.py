from fastapi import APIRouter

from app.api.v1.ai.router import router as ai_router
from app.api.v1.auth.router import router as auth_router
from app.api.v1.authors import router as authors_router
from app.api.v1.books import router as books_router
from app.api.v1.borrowing.router import router as borrowing_router
from app.api.v1.categories import router as categories_router
from app.api.v1.dashboard.router import admin_router as admin_dashboard_router
from app.api.v1.dashboard.router import user_router as user_dashboard_router
from app.api.v1.publishers import router as publishers_router
from app.api.v1.users.router import router as users_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(ai_router)
api_router.include_router(borrowing_router)
api_router.include_router(users_router)
api_router.include_router(admin_dashboard_router)
api_router.include_router(user_dashboard_router)

api_router.include_router(categories_router, prefix="/categories", tags=["Categories"])
api_router.include_router(authors_router, prefix="/authors", tags=["Authors"])
api_router.include_router(publishers_router, prefix="/publishers", tags=["Publishers"])
api_router.include_router(books_router, prefix="/books", tags=["Books"])
