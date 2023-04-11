from faker import Faker
from datetime import datetime
from sqlalchemy.sql import text
from app.models import db, DirectMessage, ChannelMessage, environment, SCHEMA

fake = Faker()


def seed_messages():

    dm_data = [
        {
            "user_id": 1,
            "_content": fake.text(max_nb_chars=100),
            "recipient_id": 2,
        },
        {
            "user_id": 2,
            "_content": fake.text(max_nb_chars=100),
            "recipient_id": 1,
        },
        {
            "user_id": 1,
            "_content": fake.text(max_nb_chars=100),
            "recipient_id": 2,
        },
        {
            "user_id": 2,
            "_content": fake.text(max_nb_chars=100),
            "recipient_id": 1,
        },
        {
            "user_id": 1,
            "_content": fake.text(max_nb_chars=100),
            "recipient_id": 2,
        },
        {
            "user_id": 2,
            "_content": fake.text(max_nb_chars=100),
            "recipient_id": 1,
        },
        {
            "user_id": 2,
            "_content": fake.text(max_nb_chars=100),
            "recipient_id": 1,
        },

    ]

    channel_message_data = [
        {
            "user_id": 1,
            "_content": fake.text(max_nb_chars=100),
            "channel_id": 2,
        },
        {
            "user_id": 2,
            "_content": fake.text(max_nb_chars=100),
            "channel_id": 1,
        },
        {
            "user_id": 1,
            "_content": fake.text(max_nb_chars=100),
            "channel_id": 2,
        },
        {
            "user_id": 2,
            "_content": fake.text(max_nb_chars=100),
            "channel_id": 1,
        },
        {
            "user_id": 1,
            "_content": fake.text(max_nb_chars=100),
            "channel_id": 2,
        },
        {
            "user_id": 2,
            "_content": fake.text(max_nb_chars=100),
            "channel_id": 1,
        },
        {
            "user_id": 2,
            "_content": fake.text(max_nb_chars=100),
            "channel_id": 1,
        },

    ]

    all_direct_messages = DirectMessage.create(dm_data)
    all_channel_messages = ChannelMessage.create(channel_message_data)

    add_dms = [db.session.add(item) for item in all_direct_messages]
    add_channel_messages = [db.session.add(
        item) for item in all_channel_messages]
    db.session.commit()


def undo_messages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.direct_messages RESTART IDENTITY CASCADE;")
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.channel_messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM direct_messages"))
        db.session.execute(text("DELETE FROM channel_messages"))

    db.session.commit()


def undo_users():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
