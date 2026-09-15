from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from scalar_fastapi import get_scalar_api_reference

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import DomainError
from app.core.openapi import use_custom_openapi
from app.schemas.error import ErrorResponse, FieldError

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=None,
    redoc_url=None,
)
use_custom_openapi(app)


@app.exception_handler(DomainError)
async def domain_error_handler(_: Request, exc: DomainError) -> JSONResponse:
    body = ErrorResponse(detail=exc.detail)
    return JSONResponse(status_code=exc.status_code, content=body.model_dump(), headers=exc.headers)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    field_errors = [
        FieldError(
            field=".".join(str(loc) for loc in err["loc"] if loc != "body"),
            message=err["msg"],
        )
        for err in exc.errors()
    ]

    if len(field_errors) == 1:
        detail = f"{field_errors[0].message}!"
    else:
        detail = f"Có {len(field_errors)} trường dữ liệu không hợp lệ!"

    body = ErrorResponse(detail=detail, errors=field_errors)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, content=body.model_dump()
    )


if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/heathz", tags=["Heathz"])
async def heathz_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/docs", include_in_schema=False)
async def scalar_docs():
    return get_scalar_api_reference(
        title=app.title,
        openapi_url=app.openapi_url,
    )
