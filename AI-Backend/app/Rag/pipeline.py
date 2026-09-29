
import logging
from pathlib import Path

from langchain_core.documents import Document

from app.Rag.document_loader import (
    Load_all_document,
)

from app.Rag.model_embedding import (
    Embedding,
)

from app.db.vector_store_mongodb import (
    add_documents,
    vector_search,
    delete_documents,
    count_documents,
)

from app.Rag.context_search import (
    BM25retrieval,
)

from app.Rag.reranking import (
    Reranking,
)

from app.Rag.clean_text import (
    clean_text,
)

from app.Rag.query import (
    transform,
)

from app.Llm.Groq_llm import (
    llm,
)

from app.core.config import (
    settings,
)


logger = logging.getLogger(__name__)


# ============================================================
# GET SELECTED FILE
# ============================================================

def get_selected_file(
    data_dir: str,
    file_name: str,
):

    logger.info(
        "Loading documents from: %s",
        data_dir,
    )


    all_documents = Load_all_document(
        data_dir=data_dir
    )


    if not all_documents:

        raise ValueError(
            "No documents found in the directory"
        )


    logger.info(
        "Total documents loaded: %s",
        len(all_documents),
    )


    requested_file = Path(
        file_name
    ).name


    selected_documents = []


    for document in all_documents:

        source = document.metadata.get(
            "source",
            "",
        )


        source_file = Path(
            str(source)
        ).name


        if source_file == requested_file:

            document.metadata[
                "file_name"
            ] = requested_file


            document.metadata[
                "source"
            ] = requested_file


            selected_documents.append(
                document
            )


    if not selected_documents:

        raise FileNotFoundError(
            f"File '{requested_file}' "
            f"not found in loaded documents"
        )


    logger.info(
        "Selected %s documents from %s",
        len(selected_documents),
        requested_file,
    )


    return selected_documents


# ============================================================
# PROCESS DOCUMENT
# ============================================================

def process_document(
    file_path: str,
    file_name: str,
):

    logger.info(
        "========== DOCUMENT PROCESS START =========="
    )


    requested_file = Path(
        file_name
    ).name


    logger.info(
        "Processing: %s",
        requested_file,
    )


    # ========================================================
    # 1. LOAD DOCUMENT
    # ========================================================

    documents = get_selected_file(
        data_dir=file_path,
        file_name=requested_file,
    )


    # ========================================================
    # 2. CLEAN DOCUMENT
    # ========================================================

    cleaned_documents = []


    for document in documents:

        cleaned = clean_text(
            document.page_content
        )


        if not cleaned:

            continue


        document.page_content = cleaned


        document.metadata[
            "file_name"
        ] = requested_file


        document.metadata[
            "source"
        ] = requested_file


        cleaned_documents.append(
            document
        )


    if not cleaned_documents:

        raise ValueError(
            f"No usable content found in "
            f"{requested_file}"
        )


    logger.info(
        "Cleaned documents: %s",
        len(cleaned_documents),
    )


    # ========================================================
    # 3. CREATE CHUNKS
    # ========================================================

    embedding = Embedding()


    chunks = embedding.chunk_documents(
        cleaned_documents
    )


    if not chunks:

        raise ValueError(
            f"No chunks created for "
            f"{requested_file}"
        )


    # ========================================================
    # 4. NORMALIZE CHUNK METADATA
    # ========================================================

    for index, chunk in enumerate(chunks):

        chunk.metadata[
            "file_name"
        ] = requested_file


        chunk.metadata[
            "source"
        ] = requested_file


        chunk.metadata[
            "chunk_index"
        ] = index


    logger.info(
        "Created %s chunks for %s",
        len(chunks),
        requested_file,
    )


    # ========================================================
    # 5. REMOVE OLD VERSION
    # ========================================================

    logger.info(
        "Removing existing chunks for %s",
        requested_file,
    )


    deleted_count = delete_documents(
        requested_file
    )


    logger.info(
        "Removed %s old chunks.",
        deleted_count,
    )


    # ========================================================
    # 6. STORE IN MONGODB
    # ========================================================

    logger.info(
        "Adding %s chunks to MongoDB...",
        len(chunks),
    )


    inserted_ids = add_documents(
        chunks
    )


    logger.info(
        "Successfully stored %s chunks.",
        len(inserted_ids),
    )


    logger.info(
        "========== DOCUMENT PROCESS COMPLETE =========="
    )


    return len(inserted_ids)


# ============================================================
# CONVERT MONGO RESULT TO LANGCHAIN DOCUMENT
# ============================================================

def mongo_to_document(
    item,
):

    metadata = (
        item.get(
            "metadata",
            {}
        )
        or {}
    )


    metadata["file_name"] = (
        item.get(
            "file_name"
        )
    )


    metadata["source"] = (
        item.get(
            "source"
        )
    )


    metadata["page"] = (
        item.get(
            "page",
            "N/A"
        )
    )


    metadata["vector_score"] = (
        item.get(
            "score"
        )
    )


    return Document(

        page_content=item.get(
            "text",
            ""
        ),

        metadata=metadata,

    )


# ============================================================
# RETRIEVE CONTEXT
# ============================================================

def retrieve_context(
    query: str,
    file_name: str,
):

    requested_file = Path(
        file_name
    ).name


    logger.info(
        "Retrieving context for: %s",
        requested_file,
    )


    # ========================================================
    # 1. LOAD SOURCE DOCUMENTS
    # ========================================================

    documents = get_selected_file(
        data_dir=settings.UPLOAD_DIR,
        file_name=requested_file,
    )


    # ========================================================
    # 2. TRANSFORM QUERY
    # ========================================================

    query_transform = transform(
        question=query
    )


    logger.info(
        "Transformed query: %s",
        query_transform,
    )


    # ========================================================
    # 3. BM25
    # ========================================================

    bm25 = BM25retrieval(
        documnents=documents
    )


    # ========================================================
    # 4. MONGODB VECTOR SEARCH
    # ========================================================

    logger.info(
        "Searching MongoDB Vector Search..."
    )


    vector_results = vector_search(
        query=query_transform,
        file_name=requested_file,
        limit=8,
    )


    if not vector_results:

        logger.warning(
            "No MongoDB vector results found."
        )


        return (
            "I don't have enough information "
            "in the company knowledge base.",
            [],
        )


    # ========================================================
    # 5. CONVERT TO LANGCHAIN DOCUMENTS
    # ========================================================

    vector_documents = [

        mongo_to_document(
            item
        )

        for item in vector_results

    ]


    # ========================================================
    # 6. BM25 SEARCH
    # ========================================================

    try:

        bm25_results = bm25.search(
            query_transform
        )

    except AttributeError:

        try:

            bm25_results = bm25.search(
                query_transform
            )

        except Exception:

            logger.exception(
                "BM25 retrieval failed."
            )

            bm25_results = []


    # ========================================================
    # 7. COMBINE VECTOR + BM25
    # ========================================================

    combined_documents = []


    seen = set()


    for doc in vector_documents:

        text = doc.page_content.strip()


        if text and text not in seen:

            combined_documents.append(
                doc
            )

            seen.add(text)


    if bm25_results:

        for doc in bm25_results:

            text = doc.page_content.strip()


            if text and text not in seen:

                combined_documents.append(
                    doc
                )

                seen.add(text)


    if not combined_documents:

        return (
            "I don't have enough information "
            "in the company knowledge base.",
            [],
        )


    logger.info(
        "Combined retrieval results: %s",
        len(combined_documents),
    )


    # ========================================================
    # 8. RERANK
    # ========================================================

    reranker = Reranking()


    docs = reranker.reranker(
        queury=query_transform,
        documents=combined_documents,
    )


    if not docs:

        logger.warning(
            "No documents after reranking."
        )


        return (
            "I don't have enough information "
            "in the company knowledge base.",
            [],
        )


    logger.info(
        "Reranking returned %s documents.",
        len(docs),
    )


    # ========================================================
    # 9. BUILD CONTEXT
    # ========================================================

    context_parts = []


    for doc in docs:

        source = doc.metadata.get(
            "source",
            requested_file,
        )


        page = doc.metadata.get(
            "page",
            "N/A",
        )


        context_parts.append(

            f"""
Source: {source}
Page: {page}

{doc.page_content}
"""

        )


    context = "\n\n".join(
        context_parts
    )


    # ========================================================
    # 10. LLM PROMPT
    # ========================================================

    prompt = f"""
You are an AI knowledge base assistant.

Answer the user's question using ONLY
the provided company documents.

Rules:

1. Do not invent information.
2. Do not use outside knowledge.
3. If the answer isn't available, say:

"I don't have enough information in the company knowledge base."

4. Be concise.
5. Cite the relevant document and page.
6. Do not assume information that is not present.
7. Do not use information outside the supplied context.

Context:

{context}

Question:

{query}
"""


    # ========================================================
    # 11. GENERATE RESPONSE
    # ========================================================

    response = llm.invoke(
        prompt
    )


    logger.info(
        "RAG response generated successfully."
    )


    return (
        response.content,
        docs,
    )


# ============================================================
# DELETE DOCUMENT
# ============================================================

def delete_document(
    file_path: str,
    file_name: str,
):

    logger.info(
        "Deleting document: %s",
        file_name,
    )


    # ========================================================
    # 1. VALIDATE FILE NAME
    # ========================================================

    requested_file = Path(
        file_name
    ).name


    if requested_file != file_name:

        raise ValueError(
            "Invalid file name"
        )


    # ========================================================
    # 2. DELETE MONGODB CHUNKS
    # ========================================================

    logger.info(
        "Deleting MongoDB chunks for: %s",
        requested_file,
    )


    deleted_chunks = delete_documents(
        requested_file
    )


    logger.info(
        "Deleted %s MongoDB chunks.",
        deleted_chunks,
    )


    # ========================================================
    # 3. DELETE PHYSICAL FILE
    # ========================================================

    directory = Path(
        file_path
    )


    target_file = (
        directory / requested_file
    )


    file_deleted = False


    if target_file.exists():

        if not target_file.is_file():

            raise ValueError(
                "Selected path is not a file"
            )


        target_file.unlink()


        file_deleted = True


        logger.info(
            "Deleted physical file: %s",
            target_file,
        )

    else:

        logger.warning(
            "Physical file not found: %s",
            target_file,
        )


    return {

        "file_name": requested_file,

        "deleted_chunks": deleted_chunks,

        "file_deleted": file_deleted,

    }

