from app.clients.node_client import (
    node_client,
    NodeAPIError
)

from app.core.config import settings
from langchain_core.tools import tool

import logging

logger = logging.getLogger(__name__)


@tool
async def get_product(
    product_id: str
):
    """
    Retrieve complete product details using the product ID.

    Use this tool when the customer asks about:
    - product details
    - product name
    - product description
    - product price
    - product stock
    - product quantity
    - product category
    - product information
    """

    # ============================================================
    # VALIDATE PRODUCT ID
    # ============================================================

    if not product_id or not product_id.strip():
        raise ValueError("Product ID is required")

    product_id = product_id.strip()

    # ============================================================
    # CALL NODE PRODUCT API
    # ============================================================

    try:
        result = await node_client.get(
            f"{settings.NODE_PRODUCT_ENDPOINT}/{product_id}"
        )

        logger.info(
            "Product API success product=%s",
            product_id
        )

        return {
            "success": True,
            "data": result
        }

    # ============================================================
    # NODE API ERROR
    # ============================================================

    except NodeAPIError as exc:

        logger.error(
            "Product API failed product=%s error=%s",
            product_id,
            exc
        )

        return {
            "success": False,
            "error": str(exc)
        }