from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from app.schemas.error import ErrorResponse


def _build_schema(app: FastAPI) -> dict:
    """Tạo và tùy chỉnh lược đồ (schema) OpenAPI cho ứng dụng FastAPI.

    Hàm này giải quyết một giới hạn đã biết của FastAPI: Khi tùy chỉnh exception handler
    cho lỗi 422 (Validation Error), FastAPI vẫn hardcode component `HTTPValidationError`
    (gồm loc/msg/type/input/ctx) mà không tự động cập nhật OpenAPI docs. Hàm này ghi đè
    component đó bằng chính schema `ErrorResponse` đang thực sự được trả về lúc runtime.

    Args:
        app (FastAPI): Thể hiện (instance) của ứng dụng FastAPI cần tạo schema.

    Returns:
        dict: Một từ điển (dictionary) chứa lược đồ OpenAPI đã được chỉnh sửa.
    """
    schema = get_openapi(title=app.title, version=app.version, routes=app.routes)

    error_schema = ErrorResponse.model_json_schema(ref_template="#/components/schemas/{model}")

    # Sử dụng .pop("$defs", {}) thay vì ["FieldError"] trực tiếp.
    # Nếu sau này ErrorResponse đổi cấu trúc (bỏ nested model, đổi tên...)
    # thì chỉ mất phần optimize này, không làm sập ứng dụng lúc khởi động.
    nested_schemas = error_schema.pop("$defs", {})

    # Ghi đè schema lỗi mặc định của FastAPI bằng custom schema của chúng ta
    schema["components"]["schemas"]["HTTPValidationError"] = error_schema
    schema["components"]["schemas"].update(nested_schemas)

    # ValidationError là schema lỗi cũ do FastAPI tự sinh (từng item loc/msg/type riêng lẻ).
    # Không còn dùng nữa vì đã thay bằng ErrorResponse ở trên nên cần loại bỏ.
    schema["components"]["schemas"].pop("ValidationError", None)

    return schema


def use_custom_openapi(app: FastAPI) -> None:
    """Ghi đè phương thức tạo OpenAPI mặc định của ứng dụng FastAPI.

    Hàm này thay thế `app.openapi` bằng một hàm tùy chỉnh. Nó giữ nguyên cơ chế
    cache của FastAPI gốc: lược đồ OpenAPI chỉ được xây dựng (build) một lần duy nhất
    cho lần gọi `/openapi.json` đầu tiên, sau đó sẽ được lưu lại và tái sử dụng
    nhằm tối ưu hiệu suất.

    Args:
        app (FastAPI): Thể hiện (instance) của ứng dụng FastAPI cần ghi đè cấu hình OpenAPI.

    Returns:
        None
    """

    def custom_openapi() -> dict:
        if app.openapi_schema is None:
            app.openapi_schema = _build_schema(app)
        return app.openapi_schema

    app.openapi = custom_openapi
