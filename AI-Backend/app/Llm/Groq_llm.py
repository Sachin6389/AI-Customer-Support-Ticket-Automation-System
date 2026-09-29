from langchain_groq import ChatGroq
from app.core.config import settings

llm = ChatGroq(
    api_key=settings.GROQ_API_KEY,
    model=settings.LLM_MODEL,
    temperature=0,

)