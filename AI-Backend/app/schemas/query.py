
from typing import Optional

from pydantic import BaseModel, Field


class References(BaseModel):

    order_id: Optional[str] = Field(
        default=None,
        description="Order ID if present",
    )

    product_id: Optional[str] = Field(
        default=None,
        description="Product ID if present",
    )

    payment_id: Optional[str] = Field(
        default=None,
        description="Payment ID if present",
    )

    ticket_id: Optional[str] = Field(
        default=None,
        description="Ticket ID if present",
    )

    user_id: Optional[str] = Field(
        default=None,
        description="User ID if present",
    )

    file_id: Optional[str] = Field(
        default=None,
        description="Uploaded file ID if present",
    )

    file_name: Optional[str] = Field(
        default=None,
        description="File name if present",
    )


class SubQuery(BaseModel):

    id: str = Field(
        description="Unique sub-query ID",
    )

    query: str = Field(
        description="Independent customer request",
    )

    references: References = Field(
        default_factory=References,
    )


class QueryPlan(BaseModel):

    summary: str = Field(
        description="Short summary of the complete customer request",
    )

    sub_queries: list[SubQuery] = Field(
        default_factory=list,
        description="Independent sub-queries extracted from the customer request",
    )
