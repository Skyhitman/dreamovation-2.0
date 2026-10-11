import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillSafe VR Platform API"
    VERSION: str = "6.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database URL: uses PostgreSQL by default, with automatic SQLite fallback for zero-setup execution
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql://postgres:postgres@localhost:5432/skillsafe"
    )
    
    # Fallback to local SQLite if PostgreSQL connection fails or isn't started yet
    USE_SQLITE_FALLBACK: bool = True
    SQLITE_URL: str = "sqlite:///./skillsafe.db"
    
    # AI Services
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = "qwen/qwen3.8-27b"
    
    # JWT / Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "skillsafe_vr_super_secret_enterprise_key_2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    
    # Google OAuth2
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
