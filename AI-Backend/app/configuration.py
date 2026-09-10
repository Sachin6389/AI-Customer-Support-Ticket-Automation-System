from functools import lru_cache

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict
)


class Settings(BaseSettings):

    groq_api_key: str
    tavily_api_key: str


    embedding_model:str="sentence-transformers/all-MiniLM-L6-v2"

    chorma_dir:str="./chroma_db"

    top_k_vector:int=10
    top_k_bm25:int=10
    top_k_rerank:int=5

    model_name: str = (
        "openai/gpt-oss-120b"
    )

    app_name: str = (
        "Advanced AI Agent Capstone"
    )

    database_path: str = (
        "agent_state.db"
    )

    reports_dir: str = (
        "../data/reports"
    )

    documents_dir: str = (
        "../data/documents"
    )

    cors_origins: str = (
        "http://localhost:5173"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    @property
    def cors_origin_list(self):

        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings():

    return Settings()


settings = get_settings()