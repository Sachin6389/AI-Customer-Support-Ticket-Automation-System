from langgraph.graph import (
    StateGraph,
    START,
    END
)

from app.agent.state import QueryState

from app.agent.decomposer import (
    decompose_query
)

from app.agent.nodes import (
    intent_node,
    operation_node,
    collect_results_node
)

from app.agent.grounded import (
    grounded_response
)


# ============================================================
# DECOMPOSE
# ============================================================

async def decompose_node(
    state: QueryState
):

    plan = await decompose_query(
        query=state["original_query"],
        conversation=state.get(
            "messages",
            []
        )
    )

    return {
        "summary": plan.summary,
        "sub_queries": [
            item.model_dump()
            for item in plan.sub_queries
        ]
    }


# ============================================================
# GROUNDING
# ============================================================

async def grounded_node(
    state: QueryState
):

    answer = await grounded_response(
        state
    )

    return {
        "final_answer": answer
    }


# ============================================================
# GRAPH
# ============================================================

def create_support_graph():

    graph = StateGraph(
        QueryState
    )

    graph.add_node(
        "decompose",
        decompose_node
    )

    graph.add_node(
        "intent",
        intent_node
    )

    graph.add_node(
        "operation",
        operation_node
    )

    graph.add_node(
        "collect_results",
        collect_results_node
    )

    graph.add_node(
        "grounded",
        grounded_node
    )

    graph.add_edge(
        START,
        "decompose"
    )

    graph.add_edge(
        "decompose",
        "intent"
    )

    graph.add_edge(
        "intent",
        "operation"
    )

    graph.add_edge(
        "operation",
        "collect_results"
    )

    graph.add_edge(
        "collect_results",
        "grounded"
    )

    graph.add_edge(
        "grounded",
        END
    )

    return graph.compile()


support_graph = create_support_graph()