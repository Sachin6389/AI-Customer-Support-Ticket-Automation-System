import logging
import json

from app.tools.order_tools import check_order_status
from app.tools.payment_tools import check_payment_status
from app.tools.product_tools import get_product

from app.tools.Ticket_tools import (
    create_complaint,
    get_user_complaints,
    escalate_complaint,
)

from app.tools.document_search import document_search


logger = logging.getLogger(__name__)


# ============================================================
# HELPER
# ============================================================

def operation_failure(
    operation: str,
    error: str,
    requires_human: bool = True,
) -> dict:

    return {
        "success": False,
        "operation": operation,
        "answer": error,
        "error": error,
        "requires_human": requires_human,
        "evidence": [],
    }


# ============================================================
# RAG / KNOWLEDGE SEARCH
# ============================================================

async def knowledge_search(
    query: str,
    file_name: str | None = None,
) -> dict:

    try:

        if not query or not query.strip():

            return {
                "success":True,
                "operation":"knowledge_search",
                "answer":"Please provide your User Id",
                "requires_human":False,
                "evidence":[]
            } 

        query = query.strip()

        result = document_search.invoke(
            {
                "query": query,
                "file_name": file_name,
            }
        )

        if not result:

            return operation_failure(
                operation="knowledge_search",
                error="No relevant information found.",
                requires_human=False,
            )

        if isinstance(result, str):

            try:
                result = json.loads(result)

            except json.JSONDecodeError:

                logger.error(
                    "Invalid JSON returned by document_search"
                )

                return operation_failure(
                    operation="knowledge_search",
                    error="Invalid response from document search.",
                    requires_human=True,
                )

        if not isinstance(result, dict):

            logger.error(
                "Unexpected document search result type: %s",
                type(result).__name__,
            )

            return operation_failure(
                operation="knowledge_search",
                error="Invalid document search response.",
                requires_human=True,
            )

        answer = result.get("answer")

        sources = result.get("sources", [])

        if not sources:

            return operation_failure(
                operation="knowledge_search",
                error="No relevant information found.",
                requires_human=False,
            )

        evidence = []

        for source in sources:

            if not isinstance(source, dict):
                continue

            evidence.append(
                {
                    "content": source.get(
                        "content",
                        source.get("preview", "")
                    ),
                    "source": source.get("document"),
                    "page": source.get("page"),
                    "file_name": source.get("file_name"),
                    "file_id": source.get("file_id"),
                    "chunk_id": source.get("chunk_id"),
                    "score": source.get("score"),
                }
            )

        return {
            "success": True,
            "operation": "knowledge_search",
            "answer": answer,
            "requires_human": False,
            "evidence": evidence,
        }

    except Exception:

        logger.exception(
            "Knowledge search failed | query=%s | file_name=%s",
            query,
            file_name,
        )

        return operation_failure(
            operation="knowledge_search",
            error="Knowledge search failed.",
            requires_human=True,
        )


# ============================================================
# ORDER STATUS
# ============================================================

async def order_status_operation(
    query: str,
    order_id: str | None = None,
    user_id: str | None = None,
) -> dict:

    try:

        if not order_id:

            return {
                "success":True,
                "operation":"order_status",
                "answer":"Please provide your Order ID so I can check the order details and provide you with the latest status.",
                "requires_human" : False,
                "evidence":[]
            }
              

        if not user_id:
            return {
                "success":True,
                "operation":"order_status",
                "answer":"Please provide your User ID so I can check the order details and provide you with the latest status.",
                "requires_human":False,
                "evidence":[]
            }

            

        order_id = order_id.strip()
        user_id = user_id.strip()

        logger.info(
            "Checking order status | order_id=%s | user_id=%s",
            order_id,
            user_id,
        )

        result = await check_order_status.ainvoke(
            {
                "order_id": order_id,
                "user_id": user_id,
            }
        )

        if not result:

            return operation_failure(
                operation="order_status",
                error="Order service returned no result.",
                requires_human=True,
            )

        success = result.get("success", False)

        if not success:

            return {
                "success": False,
                "operation": "order_status",
                "answer": result,
                "error": result.get(
                    "error",
                    "Unable to check order status."
                ),
                "requires_human": True,
                "evidence": [
                    {
                        "type": "order_api",
                        "order_id": order_id,
                        "data": result,
                    }
                ],
            }

        return {
            "success": True,
            "operation": "order_status",
            "answer": result,
            "requires_human": False,
            "evidence": [
                {
                    "type": "order_api",
                    "order_id": order_id,
                    "data": result,
                }
            ],
        }

    except Exception:

        logger.exception(
            "Order status operation failed | order_id=%s",
            order_id,
        )

        return operation_failure(
            operation="order_status",
            error="Unable to verify the order status.",
            requires_human=True,
        )


# ============================================================
# PAYMENT STATUS
# ============================================================

async def payment_status_operation(
    query: str,
    order_id: str | None = None,
    payment_id: str | None = None,
    user_id: str | None = None,
) -> dict:

    try:

        if not order_id:

            return {
                "success":True,
                "operation":"payment_status",
                "answer":"Please provide your Order ID so I can check the payment details and provide you with the latest status.",
                "requires_human":False,
                "evidence":[]
            }
              
        if not user_id:

            return {
                "success":True,
                "operation":"payment_status",
                "answer":"Please provide your User ID  so I can check the payment details .",
                "requires_human":False,
                "evidence":[]
            }

        order_id = order_id.strip()
        user_id = user_id.strip()

        logger.info(
            "Checking payment status | order_id=%s | user_id=%s",
            order_id,
            user_id,
        )

        result = await check_payment_status.ainvoke(
            {
                "order_id": order_id,
                "user_id": user_id,
            }
        )

        if not result:

            return operation_failure(
                operation="payment_status",
                error="Payment service returned no result.",
                requires_human=True,
            )

        success = result.get("success", False)

        if not success:

            return {
                "success": False,
                "operation": "payment_status",
                "answer": result,
                "error": result.get(
                    "error",
                    "Unable to verify payment status."
                ),
                "requires_human": True,
                "evidence": [
                    {
                        "type": "payment_api",
                        "order_id": order_id,
                        "payment_id": payment_id,
                        "data": result,
                    }
                ],
            }

        return {
            "success": True,
            "operation": "payment_status",
            "answer": result,
            "requires_human": False,
            "evidence": [
                {
                    "type": "payment_api",
                    "order_id": order_id,
                    "payment_id": payment_id,
                    "data": result,
                }
            ],
        }

    except Exception:

        logger.exception(
            "Payment status operation failed | order_id=%s",
            order_id,
        )

        return operation_failure(
            operation="payment_status",
            error="Unable to verify the payment status.",
            requires_human=True,
        )


# ============================================================
# PRODUCT
# ============================================================

async def product_operation(
    query: str,
    product_id: str | None = None,
    user_id: str | None = None,
) -> dict:

    try:

        if not product_id:

            return {
                "success":True,
                "operation":"product_info",
                "answer":"Please provide the Product ID you’re looking for so I can fetch the product details for you.",
                "requires_human":False,
                "evidence":[]
            }

        product_id = product_id.strip()

        logger.info(
            "Getting product | product_id=%s",
            product_id,
        )

        result = await get_product.ainvoke(
            {
                "product_id": product_id,
            }
        )

        if not result:

            return operation_failure(
                operation="product_info",
                error="Product service returned no result.",
                requires_human=True,
            )

        success = result.get("success", False)

        if not success:

            return {
                "success": False,
                "operation": "product_info",
                "answer": result,
                "error": result.get(
                    "error",
                    "Unable to get product information."
                ),
                "requires_human": True,
                "evidence": [
                    {
                        "type": "product_api",
                        "product_id": product_id,
                        "data": result,
                    }
                ],
            }

        return {
            "success": True,
            "operation": "product_info",
            "answer": result,
            "requires_human": False,
            "evidence": [
                {
                    "type": "product_api",
                    "product_id": product_id,
                    "data": result,
                }
            ],
        }

    except Exception:

        logger.exception(
            "Product operation failed | product_id=%s",
            product_id,
        )

        return operation_failure(
            operation="product_info",
            error="Unable to retrieve product information.",
            requires_human=True,
        )


# ============================================================
# CREATE COMPLAINT
# ============================================================

async def create_complaint_operation(
    query: str,
    user_id: str,
    order_id: str | None = None,
    payment_id: str | None = None,
) -> dict:

    try:

        # ----------------------------------------------------
        # VALIDATE USER
        # ----------------------------------------------------

        if not user_id or not user_id.strip():

            return {
                "success":True,
                "operation":"create_complaint",
                "answer":"please provide your User ID",
                "requires_human":False,
                "evidence":[]
            }

        # ----------------------------------------------------
        # VALIDATE COMPLAINT
        # ----------------------------------------------------

        if not query or not query.strip():

            return {
                "success":True,
                "operation":"create_complaint",
                "answer":"please provide your Query",
                "requires_human":False,
                "evidence":[]
            }

        user_id = user_id.strip()
        complaint = query.strip()

        logger.info(
            "Creating complaint | user_id=%s",
            user_id,
        )

        # ----------------------------------------------------
        # CALL NODE COMPLAINT TOOL
        # ----------------------------------------------------

        result = await create_complaint.ainvoke(
            {
                "user_id": user_id,
                "complaint": complaint,
            }
        )

        # ----------------------------------------------------
        # VALIDATE RESULT
        # ----------------------------------------------------

        if not result:

            return operation_failure(
                operation="create_complaint",
                error="Complaint service returned no result.",
                requires_human=True,
            )

        success = result.get(
            "success",
            False
        )

        if not success:

            return {
                "success": False,
                "operation": "create_complaint",
                "answer": result,
                "error": result.get(
                    "error",
                    "Unable to create complaint."
                ),
                "requires_human": True,
                "evidence": [
                    {
                        "type": "complaint_api",
                        "data": result,
                    }
                ],
            }

        # ----------------------------------------------------
        # SUCCESS
        # ----------------------------------------------------

        return {
            "success": True,
            "operation": "create_complaint",
            "answer": result,
            "requires_human": False,
            "evidence": [
                {
                    "type": "complaint_api",
                    "data": result,
                }
            ],
        }

    except Exception:

        logger.exception(
            "Create complaint operation failed | user_id=%s",
            user_id,
        )

        return operation_failure(
            operation="create_complaint",
            error="Unable to create complaint.",
            requires_human=True,
        )


# ============================================================
# GET USER COMPLAINTS
# ============================================================

async def get_user_complaints_operation(
    query: str,
    user_id: str,
) -> dict:

    try:

        # ----------------------------------------------------
        # VALIDATE USER
        # ----------------------------------------------------

        if not user_id or not user_id.strip():

            return{
                "success":True,
                "operation":"get_user_complaints",
                "answer":"Please provide your User Id",
                "requires_human":False,
                "evidence":[]
            }
        

        user_id = user_id.strip()

        logger.info(
            "Getting user complaints | user_id=%s",
            user_id,
        )

        # ----------------------------------------------------
        # CALL NODE COMPLAINT TOOL
        # ----------------------------------------------------

        result = await get_user_complaints.ainvoke(
            {
                "user_id": user_id,
            }
        )

        # ----------------------------------------------------
        # VALIDATE RESULT
        # ----------------------------------------------------

        if not result:

            return operation_failure(
                operation="get_user_complaints",
                error="Complaint service returned no result.",
                requires_human=True,
            )

        success = result.get(
            "success",
            False
        )

        if not success:

            return {
                "success": False,
                "operation": "get_user_complaints",
                "answer": result,
                "error": result.get(
                    "error",
                    "Unable to fetch complaints."
                ),
                "requires_human": True,
                "evidence": [
                    {
                        "type": "complaint_api",
                        "user_id": user_id,
                        "data": result,
                    }
                ],
            }

        # ----------------------------------------------------
        # SUCCESS
        # ----------------------------------------------------

        return {
            "success": True,
            "operation": "get_user_complaints",
            "answer": result,
            "requires_human": False,
            "evidence": [
                {
                    "type": "complaint_api",
                    "user_id": user_id,
                    "data": result,
                }
            ],
        }

    except Exception:

        logger.exception(
            "Get user complaints operation failed | user_id=%s",
            user_id,
        )

        return operation_failure(
            operation="get_user_complaints",
            error="Unable to retrieve user complaints.",
            requires_human=True,
        )


# ============================================================
# ESCALATE COMPLAINT
# ============================================================

async def escalation_operation(
    query: str,
    user_id: str,
    order_id: str | None = None,
    payment_id: str | None = None,
    ticket_id: str | None = None,
    reason: str | None = None,
    priority: str = "high",
) -> dict:

    try:

        # ----------------------------------------------------
        # VALIDATE USER
        # ----------------------------------------------------

        if not user_id or not user_id.strip():

            return {
                "success":True,
                "operation":"human_escalation",
                "answer":"Please provide your User Id",
                "requires_human":False,
                 "evidence":[]
            }

        # ----------------------------------------------------
        # VALIDATE COMPLAINT
        # ----------------------------------------------------

        if not query or not query.strip():

            return {
                "success":True,
                "operation":"human_escalation",
                "answer":"Please provide your Query.",
                "requires_human":False,
                "evidence":[]
            }

        # ----------------------------------------------------
        # VALIDATE PRIORITY
        # ----------------------------------------------------

        allowed_priorities = [
            "low",
            "medium",
            "high",
            "critical",
        ]

        priority = priority.lower().strip()

        if priority not in allowed_priorities:

            return operation_failure(
                operation="human_escalation",
                error=(
                    f"Invalid priority. "
                    f"Allowed values: {allowed_priorities}"
                ),
                requires_human=True,
            )

        user_id = user_id.strip()
        complaint = query.strip()

        escalation_reason = (
            reason.strip()
            if reason and reason.strip()
            else "AI agent could not resolve the complaint"
        )

        logger.warning(
            "Escalating complaint | user_id=%s | priority=%s",
            user_id,
            priority,
        )

        # ----------------------------------------------------
        # CALL NODE ESCALATION TOOL
        # ----------------------------------------------------

        result = await escalate_complaint.ainvoke(
            {
                "user_id": user_id,
                "complaint": complaint,
                "reason": escalation_reason,
                "priority": priority,
            }
        )

        # ----------------------------------------------------
        # VALIDATE RESULT
        # ----------------------------------------------------

        if not result:

            return operation_failure(
                operation="human_escalation",
                error="Escalation service returned no result.",
                requires_human=True,
            )

        success = result.get(
            "success",
            False
        )

        # ----------------------------------------------------
        # FAILURE
        # ----------------------------------------------------

        if not success:

            return {
                "success": False,
                "operation": "human_escalation",
                "answer": result,
                "error": result.get(
                    "error",
                    "Unable to escalate complaint."
                ),
                "requires_human": True,
                "evidence": [
                    {
                        "type": "escalation_api",
                        "user_id": user_id,
                        "data": result,
                    }
                ],
            }

        # ----------------------------------------------------
        # NODE TOOL RETURNS:
        #
        # {
        #     "success": True,
        #     "data": result
        # }
        # ----------------------------------------------------

        data = result.get(
            "data",
            {}
        )

        if not isinstance(data, dict):
            data = {}

        # ----------------------------------------------------
        # SUCCESS
        # ----------------------------------------------------

        return {
            "success": True,
            "operation": "human_escalation",
            "answer": result,
            "requires_human": False,

            # Returned by your Node escalateComplaint API
            "token_id": data.get(
                "tokenId"
            ),

            "ticket_id": data.get(
                "complaintId"
            ),

            "ticket_status": data.get(
                "status",
                "escalated"
            ),

            "priority": data.get(
                "priority",
                priority
            ),

            "reason": data.get(
                "reason",
                escalation_reason
            ),

            "human_escalation": True,

            "evidence": [
                {
                    "type": "escalation_api",
                    "user_id": user_id,
                    "data": result,
                }
            ],
        }

    except Exception:

        logger.exception(
            "Human escalation operation failed | user_id=%s",
            user_id,
        )

        return {
            "success": False,
            "operation": "human_escalation",
            "answer": (
                "The complaint could not be escalated "
                "to human support."
            ),
            "error": "Human escalation failed.",
            "requires_human": True,
            "evidence": [],
        }