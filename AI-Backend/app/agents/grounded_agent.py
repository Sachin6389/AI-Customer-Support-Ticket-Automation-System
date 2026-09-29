import json
import logging

from app.Llm.Groq_llm import llm


logger = logging.getLogger(__name__)


GROUNDING_PROMPT = """
You are the Final Grounded Customer Support Agent.

Generate the final response using ONLY:

1. Verified operation results
2. Evidence
3. Original customer query

The system has already:

1. Decomposed the query.
2. Identified intents.
3. Extracted IDs and file references.
4. Executed operations.
5. Collected results.

Rules:

- Never invent information.
- Never guess.
- Never invent order status.
- Never invent payment status.
- Never invent ticket ID.
- Never invent file information.
- Never claim an operation succeeded unless success=true.
- Answer every sub-query.
- If an operation failed, clearly say it could not be verified.
- If human escalation was performed, tell the customer.
- Include ticket/token ID only when it exists in the operation result.
- Keep the response concise.

The evidence is the source of truth.
"""


async def grounded_response(
    state: dict
) -> str:

    model = llm

    operation_results = state.get(
        "operation_results",
        []
    )

    evidence = state.get(
        "evidence",
        []
    )

    prompt = f"""
{GROUNDING_PROMPT}

ORIGINAL CUSTOMER QUERY:

{state["original_query"]}


QUERY SUMMARY:

{state.get("summary", "")}


OPERATION RESULTS:

{json.dumps(
    operation_results,
    indent=2,
    default=str
)}


EVIDENCE:

{json.dumps(
    evidence,
    indent=2,
    default=str
)}


Generate the final customer response.
"""

    response = await model.ainvoke(
        prompt
    )

    return response.content