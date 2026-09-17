from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.ai.config import SearchMode, ai_settings


class AISearchRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Từ khóa hoặc câu truy vấn tự nhiên (hỗ trợ cả tiếng Việt và tiếng Anh).",
        examples=["sách học machine learning cơ bản", "Clean Code", "lập trình python"]
    )
    mode: Optional[SearchMode] = Field(
        default=ai_settings.DEFAULT_SEARCH_MODE,
        description=(
            "Thuật toán tìm kiếm sử dụng:\n"
            "* `semantic`: Tìm kiếm theo ngữ nghĩa vector (Cosine Similarity).\n"
            "* `hybrid`: Kết hợp vector ngữ nghĩa + TF-IDF từ khóa (Reciprocal Rank Fusion).\n"
            "* `keyword`: Tìm kiếm từ khóa chính xác dựa trên TF-IDF."
        ),
        examples=[SearchMode.SEMANTIC]
    )
    limit: Optional[int] = Field(
        default=5,
        ge=1,
        le=50,
        description="Số lượng kết quả tối đa muốn lấy về (1 - 50).",
        examples=[5]
    )


class AISearchResult(BaseModel):
    book_id: int = Field(..., description="ID định danh duy nhất của cuốn sách", examples=[101])
    title: str = Field(..., description="Tiêu đề cuốn sách", examples=["Python Crash Course"])
    isbn: Optional[str] = Field(None, description="Mã tiêu chuẩn quốc tế ISBN", examples=["978-1593279288"])
    author: Optional[str] = Field(None, description="Tác giả hoặc đồng tác giả", examples=["Eric Matthes"])
    category: Optional[str] = Field(None, description="Thể loại / Danh mục phân loại sách", examples=["Programming"])
    publisher: Optional[str] = Field(None, description="Nhà xuất bản", examples=["No Starch Press"])
    score: float = Field(
        ...,
        description="Điểm độ tương đồng hoặc điểm kết hợp RRF (càng cao càng khớp)",
        examples=[0.7492]
    )


class AISearchResponse(BaseModel):
    query: str = Field(..., description="Chuỗi truy vấn gốc từ client", examples=["sách học python"])
    mode: SearchMode = Field(..., description="Chế độ tìm kiếm thực tế đã áp dụng", examples=[SearchMode.SEMANTIC])
    results: List[AISearchResult] = Field(..., description="Danh sách sách tìm thấy, xếp theo thứ tự giảm dần của score")
    total: int = Field(..., description="Tổng số sách trả về trong mảng results", examples=[5])


class RecommendationItem(BaseModel):
    rank: int = Field(..., description="Thứ hạng gợi ý (bắt đầu từ 1)", examples=[1])
    book_id: int = Field(..., description="ID định danh cuốn sách", examples=[106])
    title: str = Field(..., description="Tiêu đề cuốn sách", examples=["Clean Code: A Handbook of Agile Software Craftsmanship"])
    isbn: Optional[str] = Field(None, description="Mã ISBN", examples=["978-0132350884"])
    author: Optional[str] = Field(None, description="Tên tác giả", examples=["Robert C. Martin"])
    category: Optional[str] = Field(None, description="Thể loại sách", examples=["Software Engineering"])
    score: float = Field(..., description="Điểm số đánh giá độ tương đồng hoặc độ phổ biến", examples=[0.8124])
    reason: str = Field(
        ...,
        description="Lý do đưa ra gợi ý (ví dụ: 'Similar to books you borrowed' hoặc 'Popular books')",
        examples=["Similar to books you borrowed"]
    )


class RecommendationRequest(BaseModel):
    book_ids: List[int] = Field(
        default_factory=list,
        description="Danh sách ID các cuốn sách làm căn cứ gợi ý (lịch sử mượn, sách đã xem, giỏ sách). Nếu rỗng [], hệ thống sẽ trả về sách phổ biến nhất.",
        examples=[[101, 103]]
    )
    limit: Optional[int] = Field(
        default=5,
        ge=1,
        le=20,
        description="Số lượng sách cần gợi ý (1 - 20)",
        examples=[5]
    )


class RecommendationResponse(BaseModel):
    input_books_count: int = Field(..., description="Số lượng sách đầu vào làm căn cứ tính toán", examples=[2])
    recommendations: List[RecommendationItem] = Field(..., description="Danh sách sách gợi ý")



class IndexingRequest(BaseModel):
    book_id: Optional[int] = Field(
        default=None,
        description=(
            "ID của cuốn sách cần vector hóa.\n"
            "- **Truyền số cụ thể (VD: 101)**: Chỉ cập nhật duy nhất sách đó.\n"
            "- **Để null hoặc `{}`**: Quét và đồng bộ toàn bộ catalog sách."
        ),
        examples=[101]
    )


class IndexingResponse(BaseModel):
    message: str = Field(..., description="Thông báo kết quả thực thi", examples=["Batch indexing job finished successfully."])
    details: Dict[str, Any] = Field(
        default_factory=dict,
        description="Dữ liệu chi tiết về số lượng bản ghi đã xử lý, cập nhật hoặc bỏ qua",
        examples=[{"total_checked": 24, "indexed": 24, "skipped": 0}]
    )


# Rebuild models để bảo đảm OpenAPI generator của FastAPI giải quyết forward refs
AISearchRequest.model_rebuild()
AISearchResponse.model_rebuild()
RecommendationResponse.model_rebuild()
IndexingRequest.model_rebuild()
IndexingResponse.model_rebuild()
RecommendationRequest.model_rebuild()
RecommendationResponse.model_rebuild()