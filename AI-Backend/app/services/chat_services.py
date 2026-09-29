from app.services.memory_services import (
    get_or_create_session,
    get_messages,
    get_context,
    add_message,
    update_context
)

from app.ai.graph import run_agent

from app.core.logging import logger


async def process_chat(
    session_id: str,
    user_id: str,
    message: str
):

    if not message or not message.strip():

        raise ValueError(
            "Message cannot be empty"
        )

    message = message.strip()

    logger.info(
        "Chat started session=%s user=%s",
        session_id,
        user_id
    )

    get_or_create_session(
        session_id,
        user_id
    )

    history = get_messages(
        session_id,
        user_id,
        limit=10
    )

    context = get_context(
        session_id,
        user_id
    )

    add_message(
        session_id,
        user_id,
        "user",
        message
    )

    result = await run_agent(

        session_id=session_id,

        user_id=user_id,

        message=message,

        history=history,

        context=context
    )

    add_message(
        session_id,
        user_id,
        "assistant",
        result["response"]
    )

    new_context = result.get(
        "context",
        context
    )

    update_context(
        session_id,
        user_id,
        new_context
    )

    logger.info(
        "Chat completed session=%s",
        session_id
    )

    return result