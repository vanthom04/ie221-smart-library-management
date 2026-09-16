import pytest
from httpx import AsyncClient


# =====================================================================
# 1. Tests cho AI Search
# =====================================================================

@pytest.mark.anyio
async def test_search_default_mode_is_semantic(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/search",
        json={"query": "python programming", "limit": 3},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "semantic"
    assert len(data["results"]) <= 3
    assert data["total"] == len(data["results"])


@pytest.mark.anyio
async def test_search_explicit_semantic(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/search",
        json={"query": "machine learning", "mode": "semantic", "limit": 5},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "semantic"
    assert "results" in data


@pytest.mark.anyio
async def test_search_hybrid_mode(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/search",
        json={"query": "clean code architecture", "mode": "hybrid", "limit": 5},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "hybrid"
    assert isinstance(data["results"], list)


@pytest.mark.anyio
async def test_search_keyword_mode(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/search",
        json={"query": "Python", "mode": "keyword", "limit": 5},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["mode"] == "keyword"
    assert isinstance(data["results"], list)


@pytest.mark.anyio
async def test_search_invalid_mode(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/search",
        json={"query": "python", "mode": "invalid_algorithm"},
    )
    assert response.status_code == 422


@pytest.mark.anyio
async def test_search_empty_query(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/search",
        json={"query": "", "mode": "semantic"},
    )
    assert response.status_code == 422


@pytest.mark.anyio
async def test_search_invalid_limit(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/search",
        json={"query": "python", "limit": 100},
    )
    assert response.status_code == 422


# =====================================================================
# 2. Tests cho AI Recommendation (Stateless Engine)
# =====================================================================

@pytest.mark.anyio
async def test_recommendation_with_input_books(client: AsyncClient):
    """Test gợi ý khi truyền danh sách sách đầu vào (Personalized Centroid)."""
    response = await client.post(
        "/api/v1/ai/recommendations",
        json={"book_ids": [101, 103], "limit": 3},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["input_books_count"] == 2
    assert len(data["recommendations"]) <= 3

    # Đảm bảo các sách đầu vào không bị gợi ý lại
    recommended_ids = [item["book_id"] for item in data["recommendations"]]
    assert 101 not in recommended_ids
    assert 103 not in recommended_ids


@pytest.mark.anyio
async def test_recommendation_cold_start(client: AsyncClient):
    """Test khi không truyền sách nào (Fallback về sách phổ biến)."""
    response = await client.post(
        "/api/v1/ai/recommendations",
        json={"book_ids": [], "limit": 5},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["input_books_count"] == 0
    assert len(data["recommendations"]) > 0
    # Sách được mượn nhiều nhất trong mock là cuốn 106
    assert data["recommendations"][0]["reason"] == "Popular books"


@pytest.mark.anyio
async def test_recommendation_default_payload(client: AsyncClient):
    """Test gửi body rỗng {}."""
    response = await client.post(
        "/api/v1/ai/recommendations",
        json={},
    )
    assert response.status_code == 200
    data = response.json()
    assert "recommendations" in data