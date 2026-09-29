from typing import Any, Optional ,List

from pydantic import BaseModel, Field


# ============================================================
# CHAT REQUEST
# ============================================================

class ChatRequest(BaseModel):
    session_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="Unique conversation session ID",
    )

    user_id: str = Field(
        ...,
        min_length=1,
        max_length=100,
        description="User ID from the Node.js backend",
    )

    message: str = Field(
        ...,
        min_length=1,
        max_length=5000,
        description="Customer's complete message",
    )


# ============================================================
# SUB QUERY RESULT
# ============================================================

class SubQueryResult(BaseModel):
    id: str

    query: str

    intent: Optional[str] = None

    confidence: Optional[float] = None

    operation: Optional[str] = None

    success: bool = False

    answer: Optional[str] = None

    references: dict[str, Any] = Field(
        default_factory=dict
    )


# ============================================================
# CHAT RESPONSE
# ============================================================

class ChatResponse(BaseModel):
    success: bool

    session_id: str

    response: str

    # Overall detected intent.
    # For complex queries this can be "MULTI_INTENT".
    intent: Optional[str] = None

    # Results generated from individual sub-queries
    sub_queries: list[SubQueryResult] = Field(
        default_factory=list
    )

    # Ticket / human escalation information
    token_id: Optional[str] = None

    ticket_id: Optional[str] = None

    ticket_status: Optional[str] = None

    # True when the request was transferred to human support
    human_escalation: bool = False

    # Evidence used by the grounded response
    evidence: list[dict[str, Any]] = Field(
        default_factory=list
    )


# ============================================================
# UPLOAD RESPONSE
# ============================================================

class UploadResponse(BaseModel):
    success: bool = True

    file_name: str

    chunks_created: int

    message: str

class DocumentItem(BaseModel):
    file_name: str
    extension: str
    size_bytes: int


class DocumentsResponse(BaseModel):
    success: bool
    documents: List[DocumentItem]
    count: int
    message: str