
import logging
from functools import lru_cache

from app.db.mongodb import (
    get_knowledge_collection,
)

from app.Rag.model_embedding import Embedding


logger = logging.getLogger(__name__)


# ============================================================
# EMBEDDING MODEL
# ============================================================

@lru_cache(maxsize=1)
def get_embedding_model():

    logger.info(
        "Initializing embedding model..."
    )

    embedding = Embedding()

    model = embedding.get_embeddings()

    logger.info(
        "Embedding model initialized successfully."
    )

    return model


# ============================================================
# MONGODB COLLECTION
# ============================================================

def get_vector_collection():

    return get_knowledge_collection()


# ============================================================
# ADD DOCUMENTS
# ============================================================

def add_documents(
    documents,
):
    """
    Generate embeddings and save document chunks
    into MongoDB.
    """

    if not documents:

        return []


    embedding_model = (
        get_embedding_model()
    )


    texts = [
        document.page_content
        for document in documents
    ]


    logger.info(
        "Generating embeddings for %s chunks...",
        len(texts)
    )


    vectors = (
        embedding_model.embed_documents(
            texts
        )
    )


    if not vectors:

        raise ValueError(
            "No embeddings were generated."
        )


    logger.info(
        "Generated %s embeddings.",
        len(vectors)
    )


    collection = (
        get_vector_collection()
    )


    mongo_documents = []


    for document, vector in zip(
        documents,
        vectors
    ):

        metadata = (
            document.metadata or {}
        )


        mongo_document = {

            "file_name": metadata.get(
                "file_name"
            ),

            "source": metadata.get(
                "source"
            ),

            "page": metadata.get(
                "page"
            ),

            "text": document.page_content,

            "embedding": vector,

            "metadata": metadata,

        }


        mongo_documents.append(
            mongo_document
        )


    logger.info(
        "Inserting %s chunks into MongoDB...",
        len(mongo_documents)
    )


    result = collection.insert_many(
        mongo_documents
    )


    logger.info(
        "Successfully inserted %s chunks into MongoDB.",
        len(result.inserted_ids)
    )


    return result.inserted_ids


# ============================================================
# VECTOR SEARCH
# ============================================================

def vector_search(
    query: str,
    file_name: str | None = None,
    limit: int = 8,
):
    """
    Perform MongoDB Atlas Vector Search.
    """

    embedding_model = (
        get_embedding_model()
    )


    logger.info(
        "Creating query embedding..."
    )


    query_vector = (
        embedding_model.embed_query(
            query
        )
    )


    collection = (
        get_vector_collection()
    )


    # --------------------------------------------------------
    # VECTOR SEARCH
    # --------------------------------------------------------

    vector_stage = {

        "$vectorSearch": {

            "index": "knowledge_vector_index",

            "path": "embedding",

            "queryVector": query_vector,

            "numCandidates": max(
                limit * 10,
                50
            ),

            "limit": limit,
            
            

        }

    }
     


    # --------------------------------------------------------
    # OPTIONAL FILE FILTER
    # --------------------------------------------------------

    if file_name:

        vector_stage[
            "$vectorSearch"
        ]["filter"] = {

            "file_name": file_name

        }


    pipeline = [

        vector_stage,

        {

            "$project": {

                "_id": 1,

                "text": 1,

                "file_name": 1,

                "source": 1,

                "page": 1,

                "metadata": 1,

                "score": {

                    "$meta": "vectorSearchScore"

                },

            }

        }

    ]


    logger.info(
        "Executing MongoDB vector search..."
    )


    results = list(
        collection.aggregate(
            pipeline
        )
    )


    logger.info(
        "MongoDB vector search returned %s chunks.",
        len(results)
    )


    return results


# ============================================================
# DELETE DOCUMENT
# ============================================================

def delete_documents(
    file_name: str
):
    """
    Delete all chunks belonging to a file.
    """

    collection = (
        get_vector_collection()
    )


    logger.info(
        "Deleting MongoDB chunks for: %s",
        file_name
    )


    result = collection.delete_many(
        {
            "file_name": file_name
        }
    )


    logger.info(
        "Deleted %s MongoDB chunks.",
        result.deleted_count
    )


    return result.deleted_count


# ============================================================
# COUNT DOCUMENT CHUNKS
# ============================================================

def count_documents(
    file_name: str | None = None
):

    collection = (
        get_vector_collection()
    )


    if file_name:

        return collection.count_documents(
            {
                "file_name": file_name
            }
        )


    return collection.count_documents({})

