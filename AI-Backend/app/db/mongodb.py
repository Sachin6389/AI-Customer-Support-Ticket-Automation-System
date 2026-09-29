import logging

from pymongo import MongoClient
from pymongo.errors import PyMongoError

from app.core.config import settings


logger = logging.getLogger(__name__)


client = MongoClient(
    settings.MONGODB_URI,
    serverSelectionTimeoutMS=5000,
)

database = client[
    settings.MONGODB_DATABASE
]



conversation_collection = database[
    "conversations"
]

knowledge_collection = database[ "knowledge_chunks" ]


def get_database():
    return database


def get_conversation_collection():
    return conversation_collection

def get_knowledge_collection():
    return knowledge_collection

def check_mongodb() -> bool:

    try:

        client.admin.command("ping")

        logger.info(
            "MongoDB connection successful"
        )

        return True

    except PyMongoError:

        logger.exception(
            "MongoDB connection failed"
        )

        return False