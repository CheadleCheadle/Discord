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
            "_topic": "study"
        },
        {
            "_server_id": 2,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "study"
        },
        {
            "_server_id": 3,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "gaming"
        },
        {
            "_server_id": 4,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "gaming"
        },
        {
            "_server_id": 5,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "study"
        },
        {
            "_server_id": 6,
            "_name": "channel-1",
            "_type": "text",
            "_max_users": 40,
            "_topic": "gaming"
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
