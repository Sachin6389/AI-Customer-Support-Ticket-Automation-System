import logging
import re

from app.agents.oparetion import (
    knowledge_search,
    order_status_operation,
    payment_status_operation,
    product_operation,
    create_complaint_operation,
    get_user_complaints_operation,
    escalation_operation,
)



logger = logging.getLogger(__name__)

def extract_previous_info(
    conversation: dict | list | None,
) -> dict | None:
    """
    Search MongoDB conversation history for previously mentioned
    identifiers.

    Supported information:
        - order_id
        - product_id
        - payment_id
        - ticket_id
        - user_id
        - file_id
        - file_name

    Returns:
        {
            "success": True,
            "data": "...",
            "information_type": "order_id"
        }

    or None when nothing is found.
    """

    if not conversation:
        logger.warning(
            "No conversation history available for "
            "RETRIEVE_PREVIOUS_INFO"
        )
        return None

    # --------------------------------------------------------
    # Normalize MongoDB conversation structure
    # --------------------------------------------------------

    messages = []

    if isinstance(conversation, list):
        messages = conversation

    elif isinstance(conversation, dict):

        # Common MongoDB structure:
        #
        # {
        #     "_id": "...",
        #     "user_id": "...",
        #     "session_id": "...",
        #     "messages": [...]
        # }
        #
        if isinstance(
            conversation.get("messages"),
            list,
        ):
            messages = conversation["messages"]

        # Alternative structures
        elif isinstance(
            conversation.get("conversation"),
            list,
        ):
            messages = conversation["conversation"]

        elif isinstance(
            conversation.get("history"),
            list,
        ):
            messages = conversation["history"]

        else:
            # Sometimes the conversation itself may contain
            # structured references.
            messages = [conversation]

    logger.debug(
        "Searching previous information | messages=%s",
        len(messages),
    )

    # --------------------------------------------------------
    # 1. Search structured information first
    #
    # Search newest message first.
    # --------------------------------------------------------

    fields = [
        "order_id",
        "product_id",
        "payment_id",
        "ticket_id",
        "user_id",
        "file_id",
        "file_name",
    ]

    for message in reversed(messages):

        if not isinstance(message, dict):
            continue

        # Check the message itself
        for field in fields:

            value = message.get(field)

            if value:
                logger.info(
                    "Previous information found | "
                    "type=%s | value=%s",
                    field,
                    value,
                )

                return {
                    "success": True,
                    "data": str(value),
                    "information_type": field,
                }

        # Check nested references
        references = message.get("references")

        if isinstance(references, dict):

            for field in fields:

                value = references.get(field)

                if value:
                    logger.info(
                        "Previous reference found | "
                        "type=%s | value=%s",
                        field,
                        value,
                    )

                    return {
                        "success": True,
                        "data": str(value),
                        "information_type": field,
                    }

        # Check nested metadata
        metadata = message.get("metadata")

        if isinstance(metadata, dict):

            for field in fields:

                value = metadata.get(field)

                if value:
                    logger.info(
                        "Previous metadata found | "
                        "type=%s | value=%s",
                        field,
                        value,
                    )

                    return {
                        "success": True,
                        "data": str(value),
                        "information_type": field,
                    }

    # --------------------------------------------------------
    # 2. Search message text
    #
    # Useful when MongoDB stores messages like:
    #
    # {
    #   "role": "assistant",
    #   "content": "Your order ID is ORD12345"
    # }
    # --------------------------------------------------------

    patterns = {
        "order_id": [
            r"\border\s*(?:id|number|no\.?)?\s*[:#-]?\s*"
            r"(ORD[-_]?[A-Za-z0-9]+)\b",

            r"\b(ORD[-_]?[A-Za-z0-9]{3,})\b",
        ],

        "payment_id": [
            r"\bpayment\s*(?:id|number|no\.?)?\s*[:#-]?\s*"
            r"(PAY[-_]?[A-Za-z0-9]+)\b",

            r"\b(PAY[-_]?[A-Za-z0-9]{3,})\b",
        ],

        "ticket_id": [
            r"\bticket\s*(?:id|number|no\.?)?\s*[:#-]?\s*"
            r"(TKT[-_]?[A-Za-z0-9]+)\b",

            r"\b(TKT[-_]?[A-Za-z0-9]{3,})\b",

            r"\b(ESC[-_]?[A-Za-z0-9]+)\b",
        ],

        "product_id": [
            r"\bproduct\s*(?:id|number|no\.?)?\s*[:#-]?\s*"
            r"(PROD[-_]?[A-Za-z0-9]+)\b",

            r"\b(PROD[-_]?[A-Za-z0-9]{3,})\b",
        ],

        "file_id": [
            r"\bfile\s*(?:id|number|no\.?)?\s*[:#-]?\s*"
            r"(FILE[-_]?[A-Za-z0-9]+)\b",

            r"\b(FILE[-_]?[A-Za-z0-9]{3,})\b",
        ],
    }

    # Newest messages first
    for message in reversed(messages):

        if not isinstance(message, dict):
            continue

        content = message.get("content")

        # Some MongoDB schemas may use text/message
        if not content:
            content = message.get("message")

        if not content:
            content = message.get("text")

        if not isinstance(content, str):
            continue

        for information_type, regex_list in patterns.items():

            for pattern in regex_list:

                match = re.search(
                    pattern,
                    content,
                    flags=re.IGNORECASE,
                )

                if match:

                    value = match.group(1)

                    logger.info(
                        "Previous information extracted "
                        "from message | type=%s | value=%s",
                        information_type,
                        value,
                    )

                    return {
                        "success": True,
                        "data": value,
                        "information_type": information_type,
                    }

    logger.warning(
        "No previous information found in conversation"
    )

    return None



# ============================================================
# EXECUTE OPERATION
# ============================================================

async def execute_operation(
    intent: str,
    query: str,
    user_id: str,
    references: dict | None = None,
    conversation: dict | list | None = None
) -> dict:


   

    logger.info(
        "Executing operation | intent=%s | references=%s",
        intent,
        references,
    )

    result = None
    references = references or {}

    # ========================================================
    # ORDER
    # ========================================================

    if intent in [
        "ORDER_STATUS",
        "ORDER_TRACKING",
        "SHIPPING_DELAY",
    ]:

        result = await order_status_operation(
            query=query,
            user_id=user_id,
            order_id=references.get(
                "order_id"
            ),
        )

    # ========================================================
    # PAYMENT
    # ========================================================

    elif intent in [
        "PAYMENT_STATUS",
        "PAYMENT_FAILED",
    ]:

        result = await payment_status_operation(
            query=query,
            user_id=user_id,
            order_id=references.get(
                "order_id"
            ),
        )

    # ========================================================
    # PRODUCT
    # ========================================================

    elif intent in ["PRODUCT_AVAILABILITY"] :

        result = await product_operation(
            query=query,
            user_id=user_id,
            product_id=references.get(
                "product_id"
            ),
        )

    # ========================================================
    # KNOWLEDGE / RAG
    # ========================================================

    elif intent in [
        "REFUND_POLICY",
        "CANCELLATION_POLICY",
        "SHIPPING_POLICY",
        "GENERAL_FAQ",
        "PAYMENT_POLICY",
        "CUSTOMER_SUPPORT",
        "PRODUCT_INFO"
    ]:

        result = await knowledge_search(
            query=query,
            file_name=references.get(
                "file_name"
            ),
        )

    elif intent == "RETRIEVE_PREVIOUS_INFO":

        logger.info(
            "Searching MongoDB conversation for "
            "previous information"
        )

        previous_info = extract_previous_info(
            conversation
        )

        if previous_info:

            result = {
                "success": True,
                "operation":"retrieve_previous_info",
                "answer": previous_info["data"],
                "requires_human":False,
                "evidence":[]
                
            }

        else:

            result = {
                "success": False,
                "operation": "retrieve_previous_info",
                "error": (
                    "No previously provided information "
                    "was found in the conversation history."
                ),
                "requires_human": True,
                "evidence": [],
            }

    # ========================================================
    # CREATE COMPLAINT
    # ========================================================

    elif intent in [
        "CREATE_COMPLAINT",
        "CREATE_TICKET",
        "REFUND_REQUEST",
        "CANCELLATION_REQUEST",
        "PRODUCT_ISSUE",
        "ACCOUNT_ISSUE",
        "ORDER_CANCEL",
    ]:

        result = await create_complaint_operation(
            query=query,
            user_id=user_id,
            order_id=references.get(
                "order_id"
            ),
            payment_id=references.get(
                "payment_id"
            ),
        )

    # ========================================================
    # GET USER COMPLAINTS
    # ========================================================

    elif intent in [
        "COMPLAINT_STATUS",
        "COMPLAINT_HISTORY",
        "GET_COMPLAINTS",
        "MY_COMPLAINTS",
        "TICKET_STATUS",
    ]:

        result = await get_user_complaints_operation(
            query=query,
            user_id=user_id,
        )

    # ========================================================
    # EXPLICIT HUMAN ESCALATION
    # ========================================================

    elif intent == "HUMAN_ESCALATION":

        return await escalation_operation(
            query=query,
            user_id=user_id,
            order_id=references.get(
                "order_id"
            ),
            payment_id=references.get(
                "payment_id"
            ),
            ticket_id=references.get(
                "ticket_id"
            ),
            reason=(
                "Customer explicitly requested "
                "human support."
            ),
            priority="high",
        )

    # ========================================================
    # UNKNOWN INTENT
    # ========================================================

    else:

        result = {
            "success": False,
            "operation": "unknown",
            "answer": (
                "I could not determine the appropriate "
                "operation for this request."
            ),
            "error": "Unknown intent",
            "requires_human": True,
            "evidence": [],
        }

    # ========================================================
    # SAFETY CHECK
    # ========================================================

    if not result:
        logger.error(
            "Operation returned no result | intent=%s",
            intent,
        )

        return {
            "success": False,
            "operation": "unknown",
            "answer": (
                "The operation did not return a result."
            ),
            "error": "Operation returned no result.",
            "requires_human": True,
            "evidence": [],
        }

    # ========================================================
    # TOOL FAILED
    # → HUMAN ESCALATION
    # ========================================================

    if not result.get(
        "success",
        False
    ):

        # ----------------------------------------------------
        # Missing user input is NOT necessarily a tool failure
        # ----------------------------------------------------

        if result.get(
            "requires_input",
            False
        ):

            logger.info(
                "Additional input required | intent=%s",
                intent,
            )

            return result

        # ----------------------------------------------------
        # Tool/API failure
        # ----------------------------------------------------

        logger.warning(
            "Operation failed | operation=%s | error=%s",
            result.get("operation"),
            result.get("error"),
        )

        reason = result.get(
            "error",
            "Automatic operation failed.",
        )

        # ----------------------------------------------------
        # Call human escalation
        # ----------------------------------------------------

        escalation_result = await escalation_operation(
            query=query,
            user_id=user_id,
            order_id=references.get(
                "order_id"
            ),
            payment_id=references.get(
                "payment_id"
            ),
            ticket_id=references.get(
                "ticket_id"
            ),
            reason=(
                f"Automatic operation "
                f"'{result.get('operation')}' failed. "
                f"Reason: {reason}"
            ),
            priority="high",
        )

        # ----------------------------------------------------
        # Escalation succeeded
        # ----------------------------------------------------

        if escalation_result.get(
            "success",
            False
        ):

            return {
                **escalation_result,

                "original_operation": result.get(
                    "operation"
                ),

                "original_error": reason,

                "fallback": "human_escalation",
            }

        # ----------------------------------------------------
        # Both operation + escalation failed
        # ----------------------------------------------------

        logger.error(
            "Operation and human escalation both failed"
        )

        return {
            "success": False,
            "operation": "human_escalation",
            "answer": (
                "I was unable to complete the request "
                "automatically, and the human support "
                "service is currently unavailable."
            ),
            "error": (
                "Automatic operation failed and "
                "human escalation failed."
            ),
            "requires_human": True,
            "evidence": [],
        }

    # ========================================================
    # SUCCESS
    # ========================================================

    return result