from typing import List, Any

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

from app.core.config import settings


class Embedding:

    _model = None

    def __init__(
        self,
        model_name: str = settings.EMBEDDING_MODEL,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        if Embedding._model is None:
            print(f"Loading embedding model: {model_name}")

            Embedding._model = HuggingFaceEmbeddings(
                model_name=model_name,
                model_kwargs={
                    "device": "cpu"
                },
                encode_kwargs={
                    "normalize_embeddings": True
                },
            )

            print("Embedding model loaded successfully.")

        self.model = Embedding._model

    def chunk_documents(
        self,
        documents: List[Any]
    ) -> List[Any]:

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=[
                "\n\n",
                "\n",
                " ",
                ""
            ],
        )

        return splitter.split_documents(documents)

    def get_embeddings(self):
        return self.model