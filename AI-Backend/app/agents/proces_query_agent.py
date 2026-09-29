import logging

from app.agents.decompose_query_agent import decompose_query
from app.agents.intent_agent import classify_intent
from app.agents.oparetional_router import execute_operation


logger = logging.getLogger(__name__)


async def process_complex_query(
    query: str,
    user_id: str,
    conversation: list | None = None
):

    # ========================================================
    # STEP 1: DECOMPOSE
    # ========================================================

    query_plan = await decompose_query(
        query=query,
        conversation=conversation
    )


    logger.info(
        "Query decomposed | total=%s",
        len(query_plan.sub_queries)
    )


    operation_results = []

    evidence = []


    # ========================================================
    # STEP 2: PROCESS EACH SUB-QUERY
    # ========================================================

    for sub_query in query_plan.sub_queries:

        logger.info(
            "Processing sub-query | id=%s",
            sub_query.id
        )


        # ----------------------------------------------------
        # INTENT
        # ----------------------------------------------------

        intent_result = await classify_intent(
            sub_query.query
        )


        # ----------------------------------------------------
        # REFERENCES
        # ----------------------------------------------------

        references = (
            sub_query.references.model_dump(
                exclude_none=True
            )
        )


        # ----------------------------------------------------
        # OPERATION
        # ----------------------------------------------------

        result = await execute_operation(
            intent=intent_result.intent,
            query=sub_query.query,
            user_id=user_id,
            references=references,
            conversation=conversation

        )


        # ----------------------------------------------------
        # COLLECT
        # ----------------------------------------------------

        operation_data = {

            "sub_query_id":
                sub_query.id,

            "query":
                sub_query.query,

            "intent":
                intent_result.intent,

            "confidence":
                intent_result.confidence,

            "reason":
                intent_result.reason,

            "references":
                references,

            "operation":
                result.get(
                    "operation"
                ),

            "result":
                result
        }


        operation_results.append(
            operation_data
        )


        # ----------------------------------------------------
        # EVIDENCE
        # ----------------------------------------------------

        sub_evidence = result.get(
            "evidence",
            []
        )

        evidence.extend(
            sub_evidence
        )


    # ========================================================
    # RETURN
    # ========================================================

    return {

        "original_query": query,

        "summary":
            query_plan.summary,

        "sub_queries":
            operation_results,

        "operation_results":
            operation_results,

        "evidence":
            evidence
    }