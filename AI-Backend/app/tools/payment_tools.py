from app.clients.node_client import (
    node_client,
    NodeAPIError
)

from app.core.config import settings
from langchain_core.tools import tool

import logging

logger = logging.getLogger(__name__)


@tool
async def check_payment_status(
    order_id: str,
    user_id: str
):
    """
    Check the payment status of a customer's order.

    Use this tool when the customer asks about:
    - payment status
    - whether payment was successful
    - payment pending
    - payment failed
    - payment information for an order

    Requires the order ID and user ID.
    """

    if not order_id or not order_id.strip():
        raise ValueError("Order ID is required")

    if not user_id or not user_id.strip():
        raise ValueError("User ID is required")

    order_id = order_id.strip()
    user_id = user_id.strip()

    try:
        result = await node_client.get(
            f"{settings.NODE_PAYMENT_ENDPOINT}/{order_id}",
            params={
                "userId": user_id
            }
        )

        logger.info(
            "Payment API success order=%s user=%s",
            order_id,
            user_id
        )

        return {
            "success": True,
            "data": result
        }

    except NodeAPIError as exc:
        logger.error(
            "Payment API failed order=%s user=%s error=%s",
            order_id,
            user_id,
            exc
        )

        return {
            "success": False,
            "error": str(exc)
        }