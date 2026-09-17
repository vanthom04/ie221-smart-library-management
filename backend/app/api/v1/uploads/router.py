from fastapi import APIRouter, File, UploadFile

from app.core.storage import save_upload

router = APIRouter(prefix="/uploads", tags=["Uploads"])

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


@router.post("/image")
async def upload_file(file: UploadFile = File(...)):
    result = await save_upload(file=file, allowed_content_types=ALLOWED_IMAGE_TYPES)
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }
