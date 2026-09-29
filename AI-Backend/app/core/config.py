from functools import lru_cache

from pydantic_settings import (
    BaseSettings,
    SettingsConfigDict
)


class Settings(BaseSettings):

    APP_NAME: str = "AI Customer Support System"

    ENVIRONMENT: str = "development"

    GROQ_API_KEY: str

    LLM_MODEL: str = "openai/gpt-oss-120b"
    EMBEDDING_MODEL: str = (
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    MONGODB_URI: str

    MONGODB_DATABASE: str = "ai_customer_support"

    CHROMA_DIR: str = "./data/chroma"

    UPLOAD_DIR: str = "./data/uploads"

    NODE_BACKEND_URL: str

    NODE_CREATE_SUPPORT_TOKEN_ENDPOINT: str

    NODE_ORDER_ENDPOINT: str

    NODE_GET_USER_COMPLAINT_ENDPOINT:str

    NODE_PAYMENT_ENDPOINT: str

    NODE_PRODUCT_ENDPOINT: str

    NODE_EXCALETE_COMPLANT_ENDPOINT:str

    LOG_LEVEL: str = "INFO"

    MAX_FILE_SIZE_MB : int = 20

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )
    CORS_ORIGINS: str = (
        "http://localhost:5173,"
        "http://localhost:3000"
    )

    @property
    def cors_origin_list(self):

        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]


@lru_cache
def get_settings():

    return Settings()


settings = get_settings()