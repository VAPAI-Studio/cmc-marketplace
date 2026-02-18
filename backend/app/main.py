"""
CMC IP Marketplace - Main FastAPI Application
"""

import sentry_sdk
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
import logging

# Sentry error tracking (only in production, only if DSN is configured)
if settings.sentry_dsn and settings.sentry_dsn.startswith("https://"):
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        traces_sample_rate=0.2,
        environment=settings.environment,
    )

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.debug else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered IP marketplace connecting LATAM creators with global buyers",
    debug=settings.debug
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Health Check
# ==========================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CMC IP Marketplace API",
        "version": settings.app_version,
        "docs": "/docs"
    }


# ==========================================
# API Router Imports
# ==========================================

from app.api import auth, users, listings, files, ai, favorites, inquiries, admin

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(listings.router, prefix="/api", tags=["listings"])
app.include_router(files.router, prefix="/api", tags=["files"])
app.include_router(ai.router, prefix="/api", tags=["ai"])
app.include_router(favorites.router, prefix="/api", tags=["favorites"])
app.include_router(inquiries.router, prefix="/api", tags=["inquiries"])
app.include_router(admin.router, prefix="/api", tags=["admin"])


# ==========================================
# Startup / Shutdown Events
# ==========================================

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Debug mode: {settings.debug}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info(f"Shutting down {settings.app_name}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
