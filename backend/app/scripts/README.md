# Smart Library demo seed

## Chạy đầy đủ

```bash
cd backend
uv run alembic upgrade head
uv run python -m app.scripts.seed_demo
```

Nếu chưa muốn tải model SentenceTransformer:

```bash
uv run python -m app.scripts.seed_demo --skip-ai
```

Index AI riêng:

```bash
uv run python -m app.scripts.index_demo_ai
```

## Tài khoản demo

- Admin: `demo.admin@example.com`
- User 1: `demo.minhanh@example.com`
- User 2: `demo.giahuy@example.com`
- Password mặc định: `Demo123!@#`

Có thể đổi password bằng `DEMO_DEFAULT_PASSWORD`.

## Dữ liệu tạo ra

- 5 categories
- 6 publishers
- 20 authors
- 20 books
- 3 demo users
- 9 borrow records
- 2 reservations
- dữ liệu borrowing trải trên khoảng 3 tháng để Dashboard có biểu đồ
- lịch sử mượn khác nhau giữa 2 user để AI recommendation có profile
- AI embeddings cho catalog nếu không dùng `--skip-ai`

`seed_demo_base` upsert theo category name, publisher/author name, book ISBN và user email.
`seed_demo_activity` chỉ reset transaction của 3 demo users rồi tạo lại theo thời gian hiện tại.

## Production guard

Nếu `ENVIRONMENT=production` hoặc `prod`, script sẽ từ chối chạy. Nếu đây thật sự
là DB production-like dành riêng cho demo, bật rõ ràng:

```bash
ALLOW_DEMO_SEED=1 uv run python -m app.scripts.seed_demo
```