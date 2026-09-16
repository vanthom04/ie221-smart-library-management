import cloudinary.uploader
from fastapi import UploadFile
from starlette.concurrency import run_in_threadpool

from app.core import cloudinary_config  # noqa: F401
from app.core.config import settings
from app.core.exceptions import FileTooLargeError, UnsupportedFileTypeError

CHUNK_SIZE = 1024 * 1024  # 1MB


async def save_upload(file: UploadFile, *, allowed_content_types: dict[str, str]) -> dict:
    """Tải tệp tin (file) lên Cloudinary và trả về thông tin định danh.

    Hàm này thực hiện kiểm tra định dạng (Content-Type) và dung lượng tệp tin
    trước khi tải lên. Do hàm `upload` của SDK Cloudinary là đồng bộ (synchronous),
    tiến trình tải lên được đưa vào threadpool để không làm nghẽn (block) event loop
    của FastAPI. Khác với việc lưu file xuống local-disk, Cloudinary sẽ tự động
    sinh `public_id` và URL riêng, loại bỏ nguy cơ bảo mật "double extension".

    Args:
        file (UploadFile): Đối tượng tệp tin được tải lên qua FastAPI.
        allowed_content_types (dict[str, str]): Từ điển chứa danh sách các Content-Type
            hợp lệ (dùng làm whitelist). Khóa là Content-Type (vd: 'image/jpeg'), giá trị
            là đuôi file tương ứng.

    Returns:
        dict: Từ điển chứa thông tin kết quả tải lên gồm:
            - `public_id` (str): Mã định danh công khai của file trên Cloudinary.
            - `secure_url` (str): Đường dẫn bảo mật (`https`) để truy cập trực tiếp vào file.

    Raises:
        UnsupportedFileTypeError: Khi định dạng file (`content_type`) không nằm trong
            danh sách cho phép `allowed_content_types`.
        FileTooLargeError: Khi dung lượng của file vượt quá giới hạn được quy định trong
            cấu hình (`settings.MAX_UPLOAD_SIZE_MB`).
    """
    if (file.content_type or "") not in allowed_content_types:
        raise UnsupportedFileTypeError("Định dạng file không được hỗ trợ!")

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    chunks: list[bytes] = []
    total = 0

    # Đọc file theo từng chunk để kiểm soát dung lượng bộ nhớ và giới hạn size
    while chunk := await file.read(CHUNK_SIZE):
        total += len(chunk)
        if total > max_bytes:
            raise FileTooLargeError(f"Dung lượng file vượt quá {settings.MAX_UPLOAD_SIZE_MB}MB!")
        chunks.append(chunk)

    # Đẩy tác vụ upload đồng bộ vào threadpool để không block event loop
    result = await run_in_threadpool(
        cloudinary.uploader.upload,
        b"".join(chunks),
        folder=settings.CLOUDINARY_UPLOAD_FOLDER,
        resource_type="image",
    )

    return {
        "public_id": result["public_id"],
        "secure_url": result["secure_url"],
    }
