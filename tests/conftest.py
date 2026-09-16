import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app
from app.core.database import engine


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture(scope="function")
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture(scope="session", autouse=True)
async def cleanup_db_engine():
    yield
    # Dọn dẹp toàn bộ connection pool khi test xong
    await engine.dispose()