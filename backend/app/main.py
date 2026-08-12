from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference

from app.api.v1.router import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_prefix=f"{settings.API_V1_PREFIX}/openapi.json",
    docs_url=None,
    redoc_url=None,
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


@app.get("/")
async def hello_world():
    return {
        "message": "Hello World!",
    }


@app.get("/heathz", tags=["Heathz"])
async def heathz_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/docs", include_in_schema=False)
async def scalar_docs():
    return get_scalar_api_reference(
        title=app.title,
        openapi_url=app.openapi_url,
    )
