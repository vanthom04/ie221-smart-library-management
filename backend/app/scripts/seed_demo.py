"""Seed toàn bộ dữ liệu demo.

Chạy đầy đủ:
    uv run python -m app.scripts.seed_demo

Bỏ qua AI:
    uv run python -m app.scripts.seed_demo --skip-ai
"""

from __future__ import annotations

import argparse
import asyncio

from app.scripts.index_demo_ai import index_demo_ai
from app.scripts.seed_demo_activity import seed_demo_activity
from app.scripts.seed_demo_base import seed_demo_base


async def run(*, skip_ai: bool) -> None:
    print("=== 1/3 Seed master data ===")
    await seed_demo_base()

    print("\n=== 2/3 Seed transaction data ===")
    await seed_demo_activity()

    if skip_ai:
        print("\n=== 3/3 AI indexing skipped ===")
        return

    print("\n=== 3/3 Index AI ===")
    await index_demo_ai()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed dữ liệu demo Smart Library")
    parser.add_argument("--skip-ai", action="store_true", help="Không tạo embedding AI")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    asyncio.run(run(skip_ai=args.skip_ai))


if __name__ == "__main__":
    main()
