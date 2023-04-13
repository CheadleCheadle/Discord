from app.models import db, friends, environment, SCHEMA, User
from sqlalchemy.sql import text


def seed_friends():

    users_list = User.query.all()
    users_list[0].add_friend([users_list[1], users_list[2]], 'pending')
    users_list[1].add_friend(users_list[2], "pending")
    #print("friends",users_list[0].list_friends())
    # users_list[0].add_friend(users_list[2], "pending")
    db.session.commit()


def undo_friends():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
