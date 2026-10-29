import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "EyeWitness: AI Forensic Composite Suite"
    APP_VERSION: str = "2.4.0-CLASSIFIED"
    ENVIRONMENT: str = "production-ready"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "eyewitness_classified_jwt_secret_key_2026_law_enforcement")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Database (SQLite fallback default)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./eyewitness.db")
    
    # AI Provider settings (Supports 'mock', 'openai', 'gemini', 'stability')
    AI_IMAGE_PROVIDER: str = os.getenv("AI_IMAGE_PROVIDER", "mock")
    AI_TEXT_PROVIDER: str = os.getenv("AI_TEXT_PROVIDER", "mock")
    AI_VIDEO_PROVIDER: str = os.getenv("AI_VIDEO_PROVIDER", "mock")
    
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    STABILITY_API_KEY: str = os.getenv("STABILITY_API_KEY", "")
    
    # Emergency SOS System
    SOS_ENABLED: bool = os.getenv("SOS_ENABLED", "true").lower() == "true"
    SOS_SANDBOX: bool = os.getenv("SOS_SANDBOX", "true").lower() == "true"
    OFFICER_EMERGENCY_PHONE: str = os.getenv("OFFICER_EMERGENCY_PHONE", "+1-555-019-2044")
    TWILIO_ACCOUNT_SID: str = os.getenv("TWILIO_ACCOUNT_SID", "")
    TWILIO_AUTH_TOKEN: str = os.getenv("TWILIO_AUTH_TOKEN", "")
    TWILIO_FROM_NUMBER: str = os.getenv("TWILIO_FROM_NUMBER", "")
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*"
    ]

settings = Settings()

