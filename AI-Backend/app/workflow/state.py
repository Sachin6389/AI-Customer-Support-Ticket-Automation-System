from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages


class QueryState(TypedDict, total=False):

    # Original user query
    original_query: str

    # Conversation history
    messages: Annotated[list, add_messages]

    # User information
    user_id: str
    session_id: str

    # Query decomposition
    summary: str
    sub_queries: list[dict]

    # Intent classification
    classified_queries: list[dict]

    # Operation results
    operation_results: list[dict]

    # Grounding
    evidence: list[dict]

    # Final response
    final_answer: str

    # Errors
    errors: list[str]

    # Escalation
    needs_escalation: bool