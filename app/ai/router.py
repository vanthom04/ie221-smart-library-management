from typing import Any, Dict, Optional
from fastapi import APIRouter, Body, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.config import ai_settings
from app.ai.repositories.book_provider import BookDataProvider
from app.ai.repositories.borrow_provider import BorrowHistoryProvider
from app.ai.repositories.embedding_repository import EmbeddingRepository
from app.ai.schemas import (
    AISearchRequest,
    AISearchResponse,
    IndexingRequest,
    IndexingResponse,
    RecommendationResponse,
)
from app.ai.services.embedding_service import EmbeddingService
from app.ai.services.semantic_search_service import SemanticSearchService
from app.ai.services.hybrid_search_service import HybridSearchService
from app.ai.services.keyword_search_service import KeywordSearchService
from app.ai.services.popularity_service import PopularityService
from app.ai.services.recommendation_service import RecommendationService
from app.ai.services.search_service import SearchService
from app.ai.services.indexing_service import BookIndexingService
from app.ai.schemas import RecommendationRequest, RecommendationResponse
from app.core.database import get_db_session

router = APIRouter(
    prefix="/api/v1/ai",
    tags=["AI Search & Recommendation Module"]
)


def get_search_service(session: AsyncSession = Depends(get_db_session)) -> SearchService:
    embed_repo = EmbeddingRepository(session)
    book_provider = BookDataProvider(session)
    embed_service = EmbeddingService.get_instance()
    keyword_service = KeywordSearchService(book_provider)

    semantic_service = SemanticSearchService(embed_repo, book_provider, embed_service)
    hybrid_service = HybridSearchService(embed_repo, book_provider, embed_service, keyword_service)

    return SearchService(semantic_service, hybrid_service, keyword_service)


def get_recommendation_service(session: AsyncSession = Depends(get_db_session)) -> RecommendationService:
    borrow_provider = BorrowHistoryProvider(session)  # Lấy count sách phổ biến
    embed_repo = EmbeddingRepository(session)
    book_provider = BookDataProvider(session)
    popularity_service = PopularityService(borrow_provider, book_provider)

    return RecommendationService(embed_repo, book_provider, popularity_service)


def get_indexing_service(session: AsyncSession = Depends(get_db_session)) -> BookIndexingService:
    return BookIndexingService(session)


# ----------------------------------------------------------------------
# 1. AI Search Endpoint
# ----------------------------------------------------------------------
@router.post(
    "/search",
    response_model=AISearchResponse,
    status_code=status.HTTP_200_OK,
    summary="Tìm kiếm sách thông minh (AI Search)",
    response_description="Danh sách các cuốn sách phù hợp nhất kèm điểm số tương quan (score)",
    responses={
        200: {"description": "Truy vấn thành công."},
        422: {"description": "Dữ liệu đầu vào không hợp lệ (ví dụ: query rỗng hoặc limit ngoài khoảng 1-50)."},
    }
)
async def search_books(
    request: AISearchRequest,
    search_service: SearchService = Depends(get_search_service),
) -> AISearchResponse:
    """
    Tìm kiếm sách hỗ trợ 3 cơ chế thuật toán khác nhau:

    ### Các chế độ tìm kiếm (`mode`):
    * **`semantic` (Mặc định)**:
      * Chuyển query người dùng thành vector 384 chiều bằng mô hình `paraphrase-multilingual-MiniLM-L12-v2`.
      * So khớp Cosine Similarity trực tiếp trên PostgreSQL với tiện ích mở rộng `pgvector`.
      * Thích hợp cho tìm kiếm theo khái niệm, ngữ cảnh ngữ nghĩa (VD: *"sách lập trình cho người mới bắt đầu"*).
    * **`hybrid`**:
      * Kết hợp điểm số Vector Cosine + TF-IDF từ khóa bằng kỹ thuật **Reciprocal Rank Fusion (RRF)**.
      * Tự động cân bằng giữa tìm kiếm từ khoá chính xác và ngữ cảnh khái quát.
    * **`keyword`**:
      * Thuần TF-IDF trên toàn bộ metadata của sách (tiêu đề, tác giả, mô tả, isbn).
    """
    active_mode = request.mode or ai_settings.DEFAULT_SEARCH_MODE
    effective_limit = request.limit or ai_settings.SEARCH_TOP_K

    results = await search_service.search(
        query=request.query,
        mode=active_mode,
        limit=effective_limit,
    )

    return AISearchResponse(
        query=request.query,
        mode=active_mode,
        results=results,
        total=len(results),
    )


# ----------------------------------------------------------------------
# 2. AI Recommendation Endpoint
# ----------------------------------------------------------------------
@router.post(
    "/recommendations",
    response_model=RecommendationResponse,
    status_code=status.HTTP_200_OK,
    summary="Gợi ý sách tương đồng dựa trên danh sách sách đã chọn/đã mượn",
    response_description="Danh sách các cuốn sách tương đồng nhất được gợi ý",
)
async def get_recommendations(
    request: RecommendationRequest,
    rec_service: RecommendationService = Depends(get_recommendation_service),
) -> RecommendationResponse:
    """
    Truyền vào danh sách ID sách (`book_ids`) để nhận gợi ý:
    - **Có sách đầu vào (VD: `[101, 103]`)**: Tính vector tâm điểm (Centroid) để tìm các sách tương tự và loại trừ các sách trong danh sách.
    - **Không có sách nào (`[]`)**: Trả về các sách được mượn nhiều nhất toàn thư viện (Popularity Fallback).
    """
    effective_limit = request.limit or 5
    count, recs = await rec_service.recommend_by_books(
        book_ids=request.book_ids,
        limit=effective_limit,
    )

    return RecommendationResponse(
        input_books_count=count,
        recommendations=recs,
    )

# ----------------------------------------------------------------------
# 3. Internal Indexing Endpoint
# ----------------------------------------------------------------------
@router.post(
    "/internal/index-books",
    response_model=IndexingResponse,
    status_code=status.HTTP_200_OK,
    summary="[Internal/Admin] Đồng bộ Vector Embeddings của sách",
    response_description="Kết quả chi tiết số lượng sách được thêm mới, cập nhật hoặc bỏ qua",
    responses={
        200: {"description": "Quá trình vector hóa và đồng bộ CSDL hoàn tất."},
    }
)
async def trigger_book_indexing(
    payload: Optional[IndexingRequest] = Body(
        default=None,
        description="Tùy chọn ID sách. Bỏ trống body hoặc truyền `{}` để quét toàn bộ kho sách."
    ),
    indexing_service: BookIndexingService = Depends(get_indexing_service),
) -> IndexingResponse:
    """
    Endpoint nội bộ phục vụ việc vector hóa và đồng bộ dữ liệu vào bảng `book_embeddings`:

    ### Trường hợp 1: Đồng bộ định kỳ toàn bộ catalog (Batch Sync)
    * **Request Body**: `{}` hoặc `null`
    * Hệ thống quét toàn bộ sách, tính mã băm **SHA-256 Content Hash** của từng sách.
    * Tự động **bỏ qua (skip)** các sách có hash không đổi, chỉ vector hóa sách mới hoặc sách có nội dung bị chỉnh sửa.

    ### Trường hợp 2: Đồng bộ tức thì một cuốn sách (Single Book Event)
    * **Request Body**: `{"book_id": 101}`
    * Dùng làm mẫu để team Backend gắn vào `BackgroundTasks` khi thủ thư thêm/sửa sách trong trang Admin.
    """
    target_book_id = payload.book_id if payload else None

    if target_book_id is not None:
        res = await indexing_service.index_single_book(target_book_id)
        return IndexingResponse(
            message=f"Indexing job finished for book {target_book_id}",
            details=res,
        )
    else:
        stats = await indexing_service.index_all_books()
        return IndexingResponse(
            message="Batch indexing job finished successfully.",
            details=stats,
        )