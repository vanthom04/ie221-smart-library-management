import hashlib
from typing import Any, Dict


class BookDocumentBuilder:
    @staticmethod
    def build_document(book_data: Dict[str, Any]) -> str:
        title = str(book_data.get("title", "")).strip()
        author = str(book_data.get("author", "Unknown Author")).strip()
        category = str(book_data.get("category", "General")).strip()
        publisher = str(book_data.get("publisher", "Unknown Publisher")).strip()
        description = str(book_data.get("description", "")).strip()

        return (
            f"Title: {title}\n"
            f"Author: {author}\n"
            f"Category: {category}\n"
            f"Publisher: {publisher}\n"
            f"Description: {description}"
        ).strip()

    @staticmethod
    def compute_hash(text: str) -> str:
        return hashlib.sha256(text.encode("utf-8")).hexdigest()