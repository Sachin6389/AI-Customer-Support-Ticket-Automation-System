import logging

from fastapi import APIRouter, HTTPException

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

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
)


logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================
# CHAT
# ============================================================

@router.post(
    "/chat",
    response_model=ChatResponse
)
async def chat(
    request: ChatRequest
):

    try:

        # ====================================================
        # 1. LOAD CONVERSATION
        # ====================================================

        conversation = await get_conversation(
            user_id=request.user_id,
            session_id=request.session_id,
            limit=10,
        )

        logger.info(
            "Conversation loaded | user_id=%s | session_id=%s | messages=%s",
            request.user_id,
            request.session_id,
            len(conversation),
        )

        # ====================================================
        # 2. PROCESS CUSTOMER QUERY
        # ====================================================

        state = await process_complex_query(
            query=request.message,
            user_id=request.user_id,
            conversation=conversation,
        )

        # ====================================================
        # 3. GROUND RESULTS
        # ====================================================

        answer = await grounded_response(
            state
        )

        # ====================================================
        # 4. GET RAW OPERATION RESULTS
        # ====================================================

        raw_operation_results = state.get(
            "operation_results",
            []
        )

        evidence = state.get(
            "evidence",
            []
        )

        # ====================================================
        # 5. NORMALIZE OPERATION RESULTS
        #
        # ChatResponse expects:
        #
        # {
        #     "id": "...",
        #     "query": "...",
        #     "intent": "...",
        #     ...
        # }
        #
        # Older operation results may contain:
        #
        # {
        #     "sub_query_id": "...",
        #     ...
        # }
        # ====================================================

        operation_results = []

        sub_queries = state.get(
            "sub_queries",
            []
        )

        for index, result in enumerate(
            raw_operation_results,
            start=1
        ):

            if not isinstance(result, dict):
                continue

            normalized = dict(result)

            # ------------------------------------------------
            # ID
            # ------------------------------------------------

            result_id = (
                normalized.get("id")
                or normalized.get("sub_query_id")
                or f"SQ-{index}"
            )

            normalized["id"] = result_id

            # Remove old field
            normalized.pop(
                "sub_query_id",
                None
            )

            # ------------------------------------------------
            # QUERY
            # ------------------------------------------------

            query = normalized.get(
                "query"
            )

            if not query:

                # Try to get query from state sub_queries
                if index - 1 < len(sub_queries):

                    sub_query = sub_queries[
                        index - 1
                    ]

                    if isinstance(
                        sub_query,
                        dict
                    ):
                        query = sub_query.get(
                            "query"
                        )

                    else:
                        query = getattr(
                            sub_query,
                            "query",
                            None
                        )

            # Final fallback
            if not query:
                query = request.message

            normalized["query"] = query

            # ------------------------------------------------
            # SUCCESS
            # ------------------------------------------------

            normalized["success"] = bool(
                normalized.get(
                    "success",
                    False
                )
            )

            # ------------------------------------------------
            # OPTIONAL FIELDS
            # ------------------------------------------------

            normalized.setdefault(
                "intent",
                None
            )

            normalized.setdefault(
                "confidence",
                None
            )

            normalized.setdefault(
                "operation",
                None
            )

            normalized.setdefault(
                "answer",
                None
            )

            normalized.setdefault(
                "references",
                {}
            )

            operation_results.append(
                normalized
            )

        # ====================================================
        # LOG NORMALIZED RESULTS
        # ====================================================

        logger.info(
            "Normalized operation results | count=%s",
            len(operation_results)
        )

        for result in operation_results:

            logger.info(
                "Operation result | id=%s | query=%s | intent=%s | success=%s",
                result.get("id"),
                result.get("query"),
                result.get("intent"),
                result.get("success"),
            )

        # ====================================================
        # 6. FIND ESCALATION INFORMATION
        # ====================================================

        token_id = None
        ticket_id = None
        ticket_status = None
        human_escalation = False

        for result in raw_operation_results:

            if not isinstance(
                result,
                dict
            ):
                continue

            if result.get(
                "human_escalation",
                False
            ):

                human_escalation = True

                token_id = (
                    result.get("token_id")
                    or token_id
                )

                ticket_id = (
                    result.get("ticket_id")
                    or ticket_id
                )

                ticket_status = (
                    result.get("ticket_status")
                    or ticket_status
                )

        # ====================================================
        # 7. DETERMINE OVERALL INTENT
        # ====================================================

        if len(operation_results) > 1:

            intent = "MULTI_INTENT"

        elif operation_results:

            intent = operation_results[0].get(
                "intent"
            )

        else:

            intent = None

        # ====================================================
        # 8. SAVE CONVERSATION
        # ====================================================

        saved = await save_conversation(
            user_id=request.user_id,
            session_id=request.session_id,
            user_message=request.message,
            assistant_message=answer,
        )

        if not saved:

            logger.warning(
                "Conversation could not be saved | "
                "user_id=%s | session_id=%s",
                request.user_id,
                request.session_id,
            )

        # ====================================================
        # 9. FRONTEND RESPONSE
        # ====================================================

        return ChatResponse(

            success=True,

            session_id=request.session_id,

            response=answer,

            intent=intent,

            sub_queries=operation_results,

            token_id=token_id,

            ticket_id=ticket_id,

            ticket_status=ticket_status,

            human_escalation=human_escalation,

            evidence=evidence,
        )

    except Exception:

        logger.exception(
            "Chat processing failed | "
            "user_id=%s | session_id=%s",
            request.user_id,
            request.session_id,
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to process customer query"
        )