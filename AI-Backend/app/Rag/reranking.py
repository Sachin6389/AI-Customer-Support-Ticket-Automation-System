from sentence_transformers import CrossEncoder

class Reranking:
    def __init__(self , model_name="cross-encoder/ms-marco-MiniLM-L-6-v2"):
        self.model= CrossEncoder(model_name)

    def reranker (self, queury, documents,top_K=1):
        pairs=[
            (queury,doc.page_content)
            for doc in documents
        ]

        scores = self.model.predict(pairs)

        rank=sorted(
            zip(documents,scores),
            key=lambda x:x[1],
            reverse=True
        )

        return [
            doc
            for doc , scores in rank[:top_K]

        ]