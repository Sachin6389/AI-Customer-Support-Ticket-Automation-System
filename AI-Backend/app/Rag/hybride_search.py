def HybrideSearch(
        query,
            vectorstore,
            bm25,
            k_vector=10,
            k_bm25=10
):
    vector_doc= vectorstore.similarity_search(
        query,
        k_vector
    )

    context_doc = bm25.search(
        query,
        k_bm25
    )

    combine=[]
    seen=set()

    for doc in vector_doc + context_doc:
        key=(
            doc.metadata.get("source"),
            doc.metadata.get("page"),
            doc.page_content
        )

        if key not in seen:
            seen.add(key)
            combine.append(doc)

    return combine
     