from rank_bm25 import BM25Okapi

class BM25retrieval:
    def __init__(self , documnents):
        self.documents=documnents

        tokenized=[
            doc.page_content.lower().split()
            for doc in documnents
        ]

        self.bm25= BM25Okapi(tokenized)

    def search (self,queury,k=10):
        token = queury.lower().split()

        result = self.bm25.get_top_n(
            token,
            self.documents,
            n=k
        )
        return result