import logging
from datetime import datetime, timezone

from app.db.mongodb import (
    get_conversation_collection,
)


logger = logging.getLogger(__name__)


collection = get_conversation_collection()


# ============================================================
# GET CONVERSATION
# ============================================================

async def get_conversation(
    user_id: str,
    session_id: str,
    limit: int = 10,
) -> list:

    try:

        document = collection.find_one(
            {
                "user_id": user_id,
                "session_id": session_id,
            }
        )

        if not document:

            return []

        messages = document.get(
            "messages",
            []
        )

        return messages[-limit:]

    except Exception:

        logger.exception(
            "Failed to load conversation | user_id=%s | session_id=%s",
            user_id,
            session_id,
        )

        return []


# ============================================================
# SAVE MESSAGE
# ============================================================

async def save_message(
    user_id: str,
    session_id: str,
    role: str,
    content: str,
) -> bool:

    try:

        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now(
                timezone.utc
            ),
        }

        collection.update_one(
            {
                "user_id": user_id,
                "session_id": session_id,
            },
            {
                "$push": {
                    "messages": message
                },
                "$set": {
                    "updated_at": datetime.now(
                        timezone.utc
                    )
                },
                "$setOnInsert": {
                    "user_id": user_id,
                    "session_id": session_id,
                    "created_at": datetime.now(
                        timezone.utc
                    ),
                },
            },
            upsert=True,
        )

        return True

    except Exception:

        logger.exception(
            "Failed to save message | user_id=%s | session_id=%s",
            user_id,
            session_id,
        )

        return False


# ============================================================
# SAVE USER + ASSISTANT MESSAGE
# ============================================================

async def save_conversation(
    user_id: str,
    session_id: str,
    user_message: str,
    assistant_message: str,
) -> bool:

    try:

        now = datetime.now(
            timezone.utc
        )

        messages = [
            {
                "role": "user",
                "content": user_message,
                "timestamp": now,
            },
            {
                "role": "assistant",
                "content": assistant_message,
                "timestamp": now,
            },
        ]

        collection.update_one(
            {
                "user_id": user_id,
                "session_id": session_id,
            },
            {
                "$push": {
                    "messages": {
                        "$each": messages
                    }
                },
                "$set": {
                    "updated_at": now
                },
                "$setOnInsert": {
                    "user_id": user_id,
                    "session_id": session_id,
                    "created_at": now,
                },
            },
            upsert=True,
        )

        return True

    except Exception:

        logger.exception(
            "Failed to save conversation"
        )

        return False