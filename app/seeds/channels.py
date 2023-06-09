from app.models import db, Channel, environment, SCHEMA
from sqlalchemy.sql import text
# from datetime import datetime


def seed_channels():
    channels_data = [
        {
            "_server_id": 1,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "study",
            "_com_type": "text"
        },
        {
            "_server_id": 1,
            "_name": "general",
            "_type": "text",
            "_max_users": 50,
            "_topic": "general",
            "_com_type": "text"
        },
        {
            "_server_id": 1,
            "_name": "code-review",
            "_type": "text",
            "_max_users": 50,
            "_topic": "general",
            "_com_type": "text"
        },
        {
            "_server_id": 1,
            "_name": "homework-help",
            "_type": "text",
            "_max_users": 50,
            "_topic": "general",
            "_com_type": "text"
        },
        {
            "_server_id": 2,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "study",
            "_com_type": "text"
        },
        {
            "_server_id": 3,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "gaming",
            "_com_type": "text"
        },
        {
            "_server_id": 4,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "gaming",
            "_com_type": "text"
        },
        {
            "_server_id": 5,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "study",
            "_com_type": "text"
        },
        {
            "_server_id": 6,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "gaming",
            "_com_type": "text"
        },
        {
            "_server_id": 7,
            "_name": "general",
            "_type": "text",
            "_max_users": 50,
            "_topic": "general",
            "_com_type": "text"
        },
        {
            "_server_id": 8,
            "_name": "general",
            "_type": "text",
            "_max_users": 50,
            "_topic": "general",
            "_com_type": "text"
        },
        {
            "_server_id": 9,
            "_name": "general",
            "_type": "text",
            "_max_users": 50,
            "_topic": "general",
            "_com_type": "text"
        },
        {
            "_server_id": 10,
            "_name": "general",
            "_type": "text",
            "_max_users": 50,
            "_topic": "general",
            "_com_type": "text"
        }
    ]

    all_channels = Channel.create(channels_data)
    add_all_channels = [db.session.add(item) for item in all_channels]
    db.session.commit()


def undo_channels():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.channels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM channels"))

    db.session.commit()
