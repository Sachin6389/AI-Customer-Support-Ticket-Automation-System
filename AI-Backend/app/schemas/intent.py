from typing import Literal, Optional
from pydantic import BaseModel


class IntentResult(BaseModel):

    intent: Literal[
        "ORDER_STATUS",
        "ORDER_TRACKING",
        "ORDER_CANCEL",
        "PAYMENT_STATUS",
        "PAYMENT_FAILED",
        "PAYMENT_POLICY",
        "REFUND_POLICY",
        "REFUND_REQUEST",
        "CANCELLATION_REQUEST",
        "CANCELLATION_POLICY",
        "SHIPPING_POLICY",
        "SHIPPING_DELAY",
        "PRODUCT_INFO",
        "PRODUCT_ISSUE",
        "PRODUCT_AVAILABILITY",
        "ACCOUNT_ISSUE",
        "GENERAL_FAQ",
        "CUSTOMER_SUPPORT",
        "CREATE_TICKET",
        "HUMAN_ESCALATION",
        "GET_COMPLAINTS",
        "RETRIEVE_PREVIOUS_INFO",
        "UNKNOWN"
    ]

    confidence: float

    reason: str

    operation: Optional[str] = None