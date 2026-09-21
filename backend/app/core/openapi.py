from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from app.schemas.error import ErrorResponse


def _build_schema(app: FastAPI) -> dict:
    """Ghi đè schema 422 bị FastAPI cố định để tài liệu khớp ErrorResponse lúc chạy."""
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
    """Thay app.openapi nhưng giữ cache gốc để không dựng lại schema mỗi request."""

    def custom_openapi() -> dict:
        if app.openapi_schema is None:
            app.openapi_schema = _build_schema(app)
        return app.openapi_schema

    app.openapi = custom_openapi
