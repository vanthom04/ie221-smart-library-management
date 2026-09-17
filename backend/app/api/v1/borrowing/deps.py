from typing import Annotated

from fastapi import Depends

from app.api.deps import DbSession
from app.repositories.borrowing_repository import BorrowingRepository
from app.services.borrowing_service import BorrowingService


def get_borrowing_repository(db: DbSession) -> BorrowingRepository:
    return BorrowingRepository(db)


BorrowingRepo = Annotated[BorrowingRepository, Depends(get_borrowing_repository)]


def get_borrowing_service(repository: BorrowingRepo) -> BorrowingService:
    return BorrowingService(repository)


BorrowingSvc = Annotated[BorrowingService, Depends(get_borrowing_service)]
