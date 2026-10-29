from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .models.face_composite import FaceStateRecord
from .seed_data import seed_database
from .routers import (
    auth, cases, suspect_sketch, scene_sketch,
    video_recon, evidence, reports, admin, sos, face_composite
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Official Police Department AI Forensic Composite Suite for turning witness descriptions into visual evidence leads."
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed database on startup
@app.on_event("startup")
def startup_event():
    seed_database()

# Register Routers
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(suspect_sketch.router)
app.include_router(scene_sketch.router)
app.include_router(video_recon.router)
app.include_router(evidence.router)
app.include_router(reports.router)
app.include_router(admin.router)
app.include_router(sos.router)
app.include_router(face_composite.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "OPERATIONAL",
        "system": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "security_level": "LAW ENFORCEMENT SENSITIVE // OFFICIAL USE ONLY"
    }

