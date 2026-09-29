from app.db.mongodb import (
    get_conversation_collection,
    get_knowledge_collection
)


def create_indexes():

    collection = get_conversation_collection()

    collection.create_index(
        [
            ("user_id", 1),
            ("session_id", 1),
        ],
        unique=True,
    )
    Knowledge_collection=get_knowledge_collection()
    Knowledge_collection.create_index(
        [
            ("file_name",1),
            ("source",1),
        ],
        
    )