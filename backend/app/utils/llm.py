from langchain_groq import ChatGroq
from ..core.config.base import settings

"""LLM provider for the application."""
class LLMProvider:
    
    @staticmethod
    def get_llm():
        return ChatGroq(
            model="llama-3.1-8b-instant",
            api_key=settings.GROQ_API_KEY
        )