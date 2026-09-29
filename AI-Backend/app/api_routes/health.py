from fastapi import APIRouter

from app.db.mongodb import check_mongodb


router = APIRouter(
    prefix="/health",
    tags=["Health"]
)


@router.get("")
async def health():

    mongo_status = check_mongodb()

    return {

        "status": "healthy",

        "mongodb": (
            "connected"
            if mongo_status
            else "disconnected"
        )
    }