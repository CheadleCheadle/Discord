from app.models import db, friends, environment, SCHEMA, User
from sqlalchemy.sql import text


def seed_friends():

    users_list = User.query.all()
    users_list[0].add_friend([users_list[1], users_list[2]], 'pending')
    users_list[1].add_friend(users_list[2], "pending")
    users_list[0].add_friend([users_list[3], users_list[4], users_list[5]], 'pending')
    users_list[1].add_friend([users_list[3], users_list[4], users_list[5]], 'pending')
    users_list[1].add_friend([users_list[6], users_list[7], users_list[8]], 'pending')
    users_list[1].add_friend([users_list[9], users_list[10]], 'pending')
    users_list[0].add_friend([users_list[6], users_list[7], users_list[8]], 'pending')
    users_list[0].add_friend([users_list[9], users_list[10]], 'pending')
    db.session.commit()


def undo_friends():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
