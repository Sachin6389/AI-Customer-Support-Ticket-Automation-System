from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api_routes.health import router as health_router
from app.api_routes.chat_routes import router as chat_router
from app.api_routes.document_routes import router as documet_router
from app.core.logging import logging_setup
from app.db.mongodb import check_mongodb
from app.db.indexes import create_indexes

logging_setup()


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description=(
        "Advanced AI Agent with Planning, "
        "Tools, Memory, MCP, Multi-Agent Workflow "
        "and Human-in-the-Loop"
    ),
)
@app.on_event("startup")
async def startup():

    # Check MongoDB
    if not check_mongodb():
        raise RuntimeError(
            "MongoDB connection failed"
        )

    # Create MongoDB indexes
    create_indexes()


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    health_router,
    prefix="/api/v1"
)

app.include_router(
    chat_router,
    prefix="/api/v1"
)

app.include_router(
    documet_router,
    prefix="/api/v1"
)


@app.get("/")
async def root():

    return {
        "name": settings.app_name,
        "status": "running",
        "docs": "/docs"
    }