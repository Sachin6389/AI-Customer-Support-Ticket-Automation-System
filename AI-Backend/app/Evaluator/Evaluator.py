from app.agents.proces_query_agent import (
    process_complex_query
)

from app.agents.grounded_agent import (
    grounded_response
)

from app.services.memory_services import (
    get_conversation,
    save_conversation,
)


async def evaluate_retrieval(
    question: str,
    expected_keywords: list[str]
):
    user_id = "6ab7ce5c2776b376b40e69df"
    session_id = "1e3206f3-9aa5-48fd-93a6-ed4b53a81469"

    # ============================================================
    # GET PREVIOUS CONVERSATION
    # ============================================================

    conversation = await get_conversation(
        user_id=user_id,
        session_id=session_id,
        limit=10
    )

    # ============================================================
    # PROCESS QUERY
    # ============================================================

    state = await process_complex_query(
        query=question,
        user_id=user_id,
        conversation=conversation
    )

    # ============================================================
    # GENERATE GROUNDED RESPONSE
    # ============================================================

    result = await grounded_response(state)

    print("\nGrounded response:")
    print(result)

    # ============================================================
    # EXTRACT RESPONSE TEXT
    # ============================================================

    response_text = ""

    if hasattr(result, "data"):

        response_data = result.data

        if hasattr(response_data, "response"):
            response_text = response_data.response

        elif isinstance(response_data, dict):
            response_text = response_data.get(
                "response",
                ""
            )

        else:
            response_text = str(response_data)

    elif isinstance(result, dict):

        response_text = result.get(
            "response",
            ""
        )

        if not response_text:

            data = result.get(
                "data",
                {}
            )

            if isinstance(data, dict):
                response_text = data.get(
                    "response",
                    ""
                )

    elif isinstance(result, str):

        response_text = result

    else:

        response_text = str(result)

    response_text = response_text or ""

    # ============================================================
    # SAVE CONVERSATION
    # ============================================================

    await save_conversation(
        user_id=user_id,
        session_id=session_id,
        user_message=question,
        assistant_message=response_text
    )

    # ============================================================
    # KEYWORD EVALUATION
    # ============================================================

    combined_text = response_text.lower()

    matched_keywords = []
    missing_keywords = []

    for keyword in expected_keywords:

        keyword_lower = keyword.lower()

        if keyword_lower in combined_text:

            matched_keywords.append(
                keyword
            )

        else:

            missing_keywords.append(
                keyword
            )

    # All expected keywords must be present
    retrieval_hit = (
        len(expected_keywords) > 0
        and len(missing_keywords) == 0
    )

    # ============================================================
    # RETURN RESULT
    # ============================================================

    return {
        "question": question,
        "response": response_text,
        "retrieval_hit": retrieval_hit,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "keyword_accuracy": (
            len(matched_keywords)
            / len(expected_keywords)
            if expected_keywords
            else 0
        )
    }