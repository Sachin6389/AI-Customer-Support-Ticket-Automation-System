from typing import Any
from pydantic import BaseModel, Field


class OperationResult(BaseModel):
    success: bool = False

    operation: str

    answer: str | None = None

    data: dict[str, Any] = Field(
        default_factory=dict
    )

    evidence: list[dict[str, Any]] = Field(
        default_factory=list
    )

    error: str | None = None

    requires_human: bool = False