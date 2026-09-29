
import logging
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import settings
from app.schemas.chat import UploadResponse ,DocumentItem,DocumentsResponse
from app.Rag.pipeline import (
    process_document,
    delete_document as pipeline_delete_document,
)


logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================
# ALLOWED FILE TYPES
# ============================================================

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".txt",
    ".json",
    ".xlsx",
    ".csv",
    ".docx",
}


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

def get_upload_dir() -> Path:
    """
    Return the configured upload directory.

    Creates the directory if it does not already exist.
    """

    upload_dir = Path(settings.UPLOAD_DIR)

    upload_dir.mkdir(
        parents=True,
        exist_ok=True,
    )

    return upload_dir


# ============================================================
# GET ALL DOCUMENTS
# ============================================================

def get_all_documents():
    """
    Return all files stored in the upload directory.
    """

    upload_dir = get_upload_dir()

    documents = [
        document
        for document in upload_dir.iterdir()
        if document.is_file()
    ]

    return documents


# ============================================================
# DOCUMENT UPLOAD
# ============================================================

@router.post(
    "/documents/upload",
    response_model=UploadResponse,
)
async def upload_document(
    file: UploadFile = File(...),
):
    """
    Upload and process a document.
    """

    # ========================================================
    # 1. VALIDATE FILENAME
    # ========================================================

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required.",
        )

    # Prevent directory traversal
    original_name = Path(file.filename).name

    # ========================================================
    # 2. VALIDATE EXTENSION
    # ========================================================

    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed types: PDF, TXT, JSON, "
                "XLSX, CSV and DOCX."
            ),
        )

    # ========================================================
    # 3. READ FILE
    # ========================================================

    try:
        content = await file.read()

    except Exception:
        logger.exception(
            "Failed to read uploaded file | file=%s",
            original_name,
        )

        raise HTTPException(
            status_code=400,
            detail="Failed to read uploaded file.",
        )

    # ========================================================
    # 4. CHECK EMPTY FILE
    # ========================================================

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    # ========================================================
    # 5. VALIDATE FILE SIZE
    # ========================================================

    max_bytes = (
        settings.MAX_FILE_SIZE_MB
        * 1024
        * 1024
    )

    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=(
                f"File exceeds "
                f"{settings.MAX_FILE_SIZE_MB} MB."
            ),
        )

    # ========================================================
    # 6. CREATE UPLOAD DIRECTORY
    # ========================================================

    upload_dir = get_upload_dir()

    # ========================================================
    # 7. CREATE FILE PATH
    # ========================================================

    save_path = upload_dir / original_name

    # ========================================================
    # 8. SAVE FILE
    # ========================================================

    try:

        save_path.write_bytes(content)

        logger.info(
            "File saved successfully | file=%s | path=%s",
            original_name,
            save_path,
        )

    except Exception:

        logger.exception(
            "Failed to save uploaded file | file=%s",
            original_name,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to save uploaded file.",
        )

    # ========================================================
    # 9. PROCESS DOCUMENT
    # ========================================================

    try:

        chunks_created = process_document(
            file_path=settings.UPLOAD_DIR,
            file_name=original_name,
        )

        logger.info(
            "Document processed successfully | "
            "file=%s | chunks=%s",
            original_name,
            chunks_created,
        )

        # ====================================================
        # 10. RETURN RESPONSE
        # ====================================================

        return UploadResponse(
            file_name=original_name,
            chunks_created=chunks_created,
            message=(
                "Document uploaded and "
                "processed successfully."
            ),
        )

    except ValueError as exc:

        logger.exception(
            "Document validation/processing error | file=%s",
            original_name,
        )

        if save_path.exists():
            save_path.unlink()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        logger.exception(
            "Document processing failed | file=%s",
            original_name,
        )

        if save_path.exists():
            save_path.unlink()

        raise HTTPException(
            status_code=500,
            detail="Document processing failed.",
        )


# ============================================================
# DELETE DOCUMENT
# ============================================================


@router.delete(
    "/documents/delete",
    response_model=UploadResponse,
)
async def delete_document_endpoint(
    file_name: str,
):


    # ========================================================
    # 1. VALIDATE FILENAME
    # ========================================================

    if not file_name or not file_name.strip():
        raise HTTPException(
            status_code=400,
            detail="Filename is required.",
        )

    # Remove unnecessary whitespace
    file_name = file_name.strip()

    # Prevent directory traversal
    original_name = Path(file_name).name

    # Make sure the provided filename was not a path
    if original_name != file_name:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename.",
        )

    # ========================================================
    # 2. VALIDATE EXTENSION
    # ========================================================

    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Allowed types: PDF, TXT, JSON, "
                "XLSX, CSV and DOCX."
            ),
        )

    # ========================================================
    # 3. GET UPLOAD DIRECTORY
    # ========================================================

    upload_dir = get_upload_dir()

    # ========================================================
    # 4. CREATE FILE PATH
    # ========================================================

    file_path = upload_dir / original_name

    # ========================================================
    # 5. CHECK FILE EXISTS
    # ========================================================

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=f"Document '{original_name}' not found.",
        )

    # ========================================================
    # 6. DELETE FROM VECTOR DATABASE
    # ========================================================

    try:

        pipeline_delete_document(
            file_path=file_path,
            file_name=original_name,
        )

        # ====================================================
        # 7. DELETE PHYSICAL FILE
        # ====================================================

        if file_path.exists():
            file_path.unlink()

        logger.info(
            "Document deleted successfully | file=%s",
            original_name,
        )

        # ====================================================
        # 8. RETURN RESPONSE
        # ====================================================

        return UploadResponse(
            file_name=original_name,
            chunks_created=0,
            message="Document deleted successfully.",
        )

    except ValueError as exc:

        logger.exception(
            "Document deletion validation error | file=%s",
            original_name,
        )

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception:

        logger.exception(
            "Document deletion failed | file=%s",
            original_name,
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to delete document.",
        )

@router.get(
    "/documents/get",
    response_model=DocumentsResponse,
)
async def get_upload_file():
    """
    Return all documents stored in the upload directory.
    """

    try:
        upload_dir = get_upload_dir()

        documents = []

        for file_path in upload_dir.iterdir():

            # Ignore directories
            if not file_path.is_file():
                continue

            extension = file_path.suffix.lower()

            # Only return supported document types
            if extension not in ALLOWED_EXTENSIONS:
                continue

            documents.append(
                DocumentItem(
                    file_name=file_path.name,
                    extension=extension,
                    size_bytes=file_path.stat().st_size,
                )
            )

        # Optional: sort alphabetically
        documents.sort(
            key=lambda document: document.file_name.lower()
        )

        logger.info(
            "Uploaded documents fetched | count=%s",
            len(documents),
        )

        return DocumentsResponse(
            success=True,
            documents=documents,
            count=len(documents),
            message="Documents fetched successfully.",
        )

    except Exception:

        logger.exception(
            "Failed to fetch uploaded documents"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch uploaded documents.",
        )   