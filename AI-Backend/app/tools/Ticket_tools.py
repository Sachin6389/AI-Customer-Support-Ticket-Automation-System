from app.clients.node_client import (
    node_client,
    NodeAPIError
)

from app.core.config import settings

from langchain_core.tools import tool

import logging


logger = logging.getLogger(__name__)


# ============================================================
# CREATE COMPLAINT
# ============================================================

@tool
async def create_complaint(
    user_id: str,
    complaint: str
):
    """
    Create a customer complaint in the support system.
    Use this when the customer wants to register a complaint.
    """

    if not user_id:
        raise ValueError(
            "User ID is required"
        )

    if not complaint or not complaint.strip():
        raise ValueError(
            "Complaint cannot be empty"
        )

    try:

        result = await node_client.get(
            settings.NODE_CREATE_SUPPORT_TOKEN_ENDPOINT,
            {
                "userId": user_id,
                "complain": complaint.strip()
            }
        )

        logger.info(
            "Complaint created successfully user=%s",
            user_id
        )

        return {
            "success": True,
            "data": result
        }

    except NodeAPIError as exc:

        logger.error(
            "Complaint creation failed: %s",
            exc
        )

        return {
            "success": False,
            "error": str(exc)
        }


# ============================================================
# GET USER COMPLAINTS
# ============================================================

@tool
async def get_user_complaints(
    user_id: str
):
    """
    Get the complaints submitted by the current customer.
    Use this when the customer wants to check their complaints,
    complaint history, or complaint status.
    """

    if not user_id:
        raise ValueError(
            "User ID is required"
        )

    try:

        result = await node_client.get(
            settings.NODE_GET_USER_COMPLAINT_ENDPOINT,
            params={
            "userId": user_id
            }
        )

        logger.info(
            "User complaints fetched user=%s",
            user_id
        )

        return {
            "success": True,
            "data": result
        }

    except NodeAPIError as exc:

        logger.error(
            "Failed to fetch complaints: %s",
            exc
        )

        return {
            "success": False,
            "error": str(exc)
        }


# ============================================================
# ESCALATE COMPLAINT
# ============================================================

@tool
async def escalate_complaint(
    user_id: str,
    complaint: str,
    reason: str = "",
    priority: str = "medium"
):
    """
    Escalate a customer's complaint from the AI assistant
    to human customer support.
    """

    if not user_id:
        raise ValueError(
            "User ID is required"
        )

    if not complaint or not complaint.strip():
        raise ValueError(
            "Complaint is required"
        )

    allowed_priority = [
        "low",
        "medium",
        "high",
        "critical"
    ]

    if priority not in allowed_priority:
        raise ValueError(
            f"Invalid priority. Allowed values: {allowed_priority}"
        )

    try:

        result = await node_client.post(
            settings.NODE_EXCALETE_COMPLANT_ENDPOINT,
            {
                "userId": user_id,
                "complaint": complaint.strip(),
                "reason": reason.strip()
                if reason
                else "AI agent could not resolve the complaint",
                "priority": priority
            }
        )

        logger.info(
            "Complaint escalated user=%s priority=%s",
            user_id,
            priority
        )

        return {
            "success": True,
            "data": result
        }

    except NodeAPIError as exc:

        logger.error(
            "Complaint escalation failed: %s",
            exc
        )

        return {
            "success": False,
            "error": str(exc)
        }