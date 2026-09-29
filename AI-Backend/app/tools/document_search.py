import json
import logging
import os
import re

from langchain_core.tools import tool

from app.Rag.pipeline import retrieve_context


logger = logging.getLogger(__name__)


@tool
def document_search(
    query: str,
    file_name: str | None = None,
) -> str:
    """
    Search uploaded documents and answer questions
    using the document content.

    If file_name is provided, search only that document.
    """

    try:

        # ----------------------------------------------------
        # VALIDATION
        # ----------------------------------------------------

        if not query or not query.strip():

            return json.dumps({
                "success": False,
                "answer": "Search query cannot be empty.",
                "sources": [],
                "error": "Empty query",
            })

        query = query.strip()

        # ----------------------------------------------------
        # RAG SEARCH
        # ----------------------------------------------------

        rag_answer, documents = retrieve_context(
            query=query,
            file_name=file_name,
        )

        documents = documents or []

        # ----------------------------------------------------
        # NO DOCUMENTS
        # ----------------------------------------------------

        if not documents:

            return json.dumps({
                "success": False,
                "answer": (
                    "I could not find relevant information "
                    "in the company knowledge base."
                ),
                "sources": [],
                "error": None,
            })

        # ----------------------------------------------------
        # BUILD SOURCES
        # ----------------------------------------------------

        sources = []

        for doc in documents:

            metadata = getattr(
                doc,
                "metadata",
                {}
            ) or {}

            source = metadata.get(
                "source",
                "unknown"
            )

            file_name_value = metadata.get(
                "file_name"
            )

            if not file_name_value:

                file_name_value = os.path.basename(
                    str(source)
                )

            file_name_value = str(
                file_name_value
            )

            # Remove UUID prefix
            file_name_value = re.sub(
                r"^[0-9a-fA-F]{20,}_",
                "",
                file_name_value
            )

            # ------------------------------------------------
            # PAGE
            # ------------------------------------------------

            page = metadata.get(
                "page"
            )

            display_page = None

            if page is not None:

                try:

                    display_page = int(page) + 1

                except (
                    TypeError,
                    ValueError
                ):

                    display_page = page

            # ------------------------------------------------
            # CONTENT
            # ------------------------------------------------

            page_content = getattr(
                doc,
                "page_content",
                ""
            ) or ""

            sources.append({
                "document": str(source),

                "file_name": file_name_value,

                "page": display_page,

                "chunk_id": metadata.get(
                    "chunk_id"
                ),

                "file_id": metadata.get(
                    "file_id"
                ),

                "score": metadata.get(
                    "score"
                ),

                "content": page_content,

                "preview": page_content[:300],
            })

        # ----------------------------------------------------
        # RETURN
        # ----------------------------------------------------

        return json.dumps(
            {
                "success": True,
                "answer": rag_answer,
                "sources": sources,
            },
            default=str
        )

    except Exception as exc:

        logger.exception(
            "DOCUMENT SEARCH ERROR | query=%s | file_name=%s",
            query,
            file_name,
        )

        return json.dumps(
            {
                "success": False,
                "answer": (
                    "I could not retrieve information "
                    "from the documents."
                ),
                "sources": [],
                "error": str(exc),
            },
            default=str
        )