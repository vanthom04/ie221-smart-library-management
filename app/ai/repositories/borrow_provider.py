from typing import Dict, List
from sqlalchemy.ext.asyncio import AsyncSession

# 17 sự kiện mượn sách chuẩn PoC
MOCK_BORROW_HISTORY = [
    {"user_id": 1, "book_id": 101},
    {"user_id": 1, "book_id": 103},
    {"user_id": 1, "book_id": 106},
    {"user_id": 2, "book_id": 110},
    {"user_id": 2, "book_id": 111},
    {"user_id": 2, "book_id": 113},
    {"user_id": 3, "book_id": 118},
    {"user_id": 3, "book_id": 120},
    {"user_id": 4, "book_id": 101},
    {"user_id": 5, "book_id": 101},
    {"user_id": 6, "book_id": 106},
    {"user_id": 7, "book_id": 106},
    {"user_id": 8, "book_id": 106},
    {"user_id": 9, "book_id": 110},
    {"user_id": 10, "book_id": 123},
    {"user_id": 11, "book_id": 123},
    {"user_id": 12, "book_id": 123},
]


class BorrowHistoryProvider:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_user_borrowed_book_ids(self, user_id: int) -> List[int]:
        return [item["book_id"] for item in MOCK_BORROW_HISTORY if item["user_id"] == user_id]

    async def get_book_borrow_counts(self) -> Dict[int, int]:
        counts: Dict[int, int] = {}
        for item in MOCK_BORROW_HISTORY:
            bid = item["book_id"]
            counts[bid] = counts.get(bid, 0) + 1
        return counts