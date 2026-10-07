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

    if not conversation:
        logger.warning(
            "No conversation history available for RETRIEVE_PREVIOUS_INFO"
        )
        return None

    # ============================================================
    # NORMALIZE CONVERSATION
    # ============================================================

    messages = []
    

    if isinstance(conversation, list):
        messages = conversation

    elif isinstance(conversation, dict):

        if isinstance(conversation.get("messages"), list):
            messages = conversation["messages"]

        elif isinstance(conversation.get("conversation"), list):
            messages = conversation["conversation"]

        elif isinstance(conversation.get("history"), list):
            messages = conversation["history"]

        else:
            messages = [conversation]

    logger.debug(
        "Searching previous information | messages=%s",
        len(messages),
    )
    

    # ============================================================
    # VALID ID VALIDATORS
    # ============================================================

    validators = {

        "Order ID": re.compile(
            r"^(?:ORD[-_]?[A-Za-z0-9]{3,}|[a-fA-F0-9]{24})$",
            re.IGNORECASE,
        ),

        "Payment ID": re.compile(
            r"^(?:PAY[-_]?[A-Za-z0-9]{3,}|[a-fA-F0-9]{24})$",
            re.IGNORECASE,
        ),

        "Product ID": re.compile(
            r"^(?:PROD[-_]?[A-Za-z0-9]{3,}|[a-fA-F0-9]{24})$",
            re.IGNORECASE,
        ),

        "Ticket ID": re.compile(
            r"^(?:TKT[-_]?[A-Za-z0-9]{3,}|ESC[-_]?[A-Za-z0-9]{3,})$",
            re.IGNORECASE,
        ),

        "File ID": re.compile(
            r"^(?:FILE[-_]?[A-Za-z0-9]{3,}|[a-fA-F0-9]{24})$",
            re.IGNORECASE,
        ),
    }

    # ============================================================
    # 1. CHECK STRUCTURED DATA
    # ============================================================

    fields = [
        "Order ID",
        "Product ID",
        "Complaint ID",
        "Payment ID",
        "Ticket ID",
        "User ID",
        "File ID",
        "File Name",
    ]

    for message in reversed(messages):

        if not isinstance(message, dict):
            continue

        # --------------------------------------------------------
        # Direct fields
        # --------------------------------------------------------

        for field in fields:

            value = message.get(field)

            if not value:
                continue

            value = str(value).strip()

            # Complaint ID is not currently treated as a retrievable
            # identifier unless you explicitly want it.
            if field == "Complaint ID":
                continue

            # User ID is normally supplied by the application and
            # should not be extracted from arbitrary conversation text.
            if field == "User ID":
                continue

            # File name is not an ID.
            if field == "File Name":
                continue

            validator = validators.get(field)

            if validator and not validator.fullmatch(value):
                logger.debug(
                    "Ignoring invalid previous value | type=%s | value=%s",
                    field,
                    value,
                )
                continue

            logger.info(
                "Previous information found | type=%s | value=%s",
                field,
                value,
            )

            return {
                "success": True,
                "data": value,
                "information_type": field,
            }

        # --------------------------------------------------------
        # Nested references
        # --------------------------------------------------------

        references = message.get("references")

        if isinstance(references, dict):

            for field in fields:

                if field in (
                    "Complaint ID",
                    "User ID",
                    "File Name",
                ):
                    continue

                value = references.get(field)

                if not value:
                    continue

                value = str(value).strip()

                validator = validators.get(field)

                if validator and not validator.fullmatch(value):
                    continue

                logger.info(
                    "Previous reference found | type=%s | value=%s",
                    field,
                    value,
                )

                return {
                    "success": True,
                    "data": value,
                    "information_type": field,
                }

    # ============================================================
    # 2. SEARCH MESSAGE TEXT
    # ============================================================

    # IMPORTANT:
    # Do NOT use:
    #
    #     PAY[-_]?[A-Za-z0-9]{3,}
    #
    # because "Payment" matches:
    #
    #     PAY + ment
    #
    # Instead, explicitly require a delimiter/prefix format OR
    # a standalone 24-character MongoDB ObjectId.

    text_patterns = {

        "order_id": [
            re.compile(
                r"\bORD[-_]?[A-Za-z0-9]{3,}\b",
                re.IGNORECASE,
            ),
            re.compile(
                r"\b[0-9a-fA-F]{24}\b",
            ),
        ],

        "payment_id": [
            re.compile(
                r"\bPAY[-_]?[0-9A-Za-z]{3,}\b",
                re.IGNORECASE,
            ),
        ],

        "ticket_id": [
            re.compile(
                r"\b(?:TKT|ESC)[-_]?[A-Za-z0-9]{3,}\b",
                re.IGNORECASE,
            ),
        ],

        "product_id": [
            re.compile(
                r"\bPROD[-_]?[A-Za-z0-9]{3,}\b",
                re.IGNORECASE,
            ),
        ],

        "file_id": [
            re.compile(
                r"\bFILE[-_]?[A-Za-z0-9]{3,}\b",
                re.IGNORECASE,
            ),
        ],
    }

    # ------------------------------------------------------------
    # Search newest messages first
    # ------------------------------------------------------------

    for message in reversed(messages):

        if not isinstance(message, dict):
            continue

        content = (
            message.get("content")
            or message.get("message")
            or message.get("text")
        )

        if not isinstance(content, str):
            continue

        content = content.strip()

        # --------------------------------------------------------
        # Explicit labels should have highest priority
        # --------------------------------------------------------

        explicit_patterns = {

            "order_id": re.compile(
                r"(?:Order\s*ID|order_id)\s*[:=#-]?\s*"
                r"([0-9a-fA-F]{24}|ORD[-_]?[A-Za-z0-9]{3,})",
                re.IGNORECASE,
            ),

            "payment_id": re.compile(
                r"(?:Payment\s*ID|payment_id)\s*[:=#-]?\s*"
                r"(PAY[-_]?[A-Za-z0-9]{3,})",
                re.IGNORECASE,
            ),

            "product_id": re.compile(
                r"(?:Product\s*ID|product_id)\s*[:=#-]?\s*"
                r"(PROD[-_]?[A-Za-z0-9]{3,})",
                re.IGNORECASE,
            ),

            "ticket_id": re.compile(
                r"(?:Ticket\s*ID|Complaint\s*ID|ticket_id)\s*[:=#-]?\s*"
                r"((?:TKT|ESC)[-_]?[A-Za-z0-9]{3,})",
                re.IGNORECASE,
            ),

            "file_id": re.compile(
                r"(?:File\s*ID|file_id)\s*[:=#-]?\s*"
                r"(FILE[-_]?[A-Za-z0-9]{3,})",
                re.IGNORECASE,
            ),
        }

        for information_type, pattern in explicit_patterns.items():

            match = pattern.search(content)

            if not match:
                continue

            value = match.group(1).strip()

            logger.info(
                "Previous information extracted from explicit field | "
                "type=%s | value=%s",
                information_type,
                value,
            )

            return {
                "success": True,
                "data": value,
                "information_type": information_type,
            }

        # --------------------------------------------------------
        # Generic identifier search
        # --------------------------------------------------------

        for information_type, regex_list in text_patterns.items():

            for pattern in regex_list:

                match = pattern.search(content)

                if not match:
                    continue

                value = match.group(0).strip()

                # ------------------------------------------------
                # Extra validation
                # ------------------------------------------------

                if information_type == "payment_id":

                    # Prevent words such as:
                    # Payment
                    # Payments
                    # PaymentStatus
                    #
                    # Only PAY-prefixed IDs are accepted.

                    if not re.fullmatch(
                        r"PAY[-_]?[A-Za-z0-9]{3,}",
                        value,
                        re.IGNORECASE,
                    ):
                        continue

                    # "Payment" can still theoretically match the
                    # old regex, so explicitly reject it.
                    if value.lower() in {
                        "payment",
                        "payments",
                        "paymentid",
                        "payment_id",
                    }:
                        continue

                if information_type == "order_id":

                    valid = re.fullmatch(
                        r"(?:ORD[-_]?[A-Za-z0-9]{3,}|[0-9a-fA-F]{24})",
                        value,
                        re.IGNORECASE,
                    )

                    if not valid:
                        continue

                if information_type == "product_id":

                    valid = re.fullmatch(
                        r"PROD[-_]?[A-Za-z0-9]{3,}",
                        value,
                        re.IGNORECASE,
                    )

                    if not valid:
                        continue

                if information_type == "ticket_id":

                    valid = re.fullmatch(
                        r"(?:TKT|ESC)[-_]?[A-Za-z0-9]{3,}",
                        value,
                        re.IGNORECASE,
                    )

                    if not valid:
                        continue

                if information_type == "file_id":

                    valid = re.fullmatch(
                        r"FILE[-_]?[A-Za-z0-9]{3,}",
                        value,
                        re.IGNORECASE,
                    )

                    if not valid:
                        continue

                logger.info(
                    "Previous information extracted from message | "
                    "type=%s | value=%s",
                    information_type,
                    value,
                )

                return {
                    "success": True,
                    "data": value,
                    "information_type": information_type,
                }

    # ============================================================
    # NOTHING FOUND
    # ============================================================

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
            "success": True,
            "operation": "unknown",
            "answer": (
                "Can you write your questions clearly so I can understand what answer to search for—for example, “What is my payment status?” or “What is my order status?” Also, mention the related topic, such as “How can I get a refund?” → `refund_policy.pdf`."  
            ),
            "requires_human": False,
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