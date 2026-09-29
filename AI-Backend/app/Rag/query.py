from langchain_groq import ChatGroq
from app.Llm.Groq_llm import llm



def transform (question:str):
    prompt=f"""
      You are a search query optimizer.

Rewrite the user's question into a concise
search query suitable for a AI knowledge base.

Do not answer the question.

User question:
{question}

Return only the rewritten query."""
    response= llm.invoke(prompt)
    return response.content.strip()