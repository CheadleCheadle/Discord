from app.models import db, friends, environment, SCHEMA, User
from sqlalchemy.sql import text


def seed_friends():
    # friend_status1 = friends(
    #     user1_id=1,
    #     user2_id=2,
    #     status="friends"
    # )
    # friend_status2 = friends(
    #     user1_id=1,
    #     user2_id=3,
    #     status="friends"
    # )
    # friend_status3 = friends(
    #     user1_id=2,
    #     user2_id=3,
    #     status="friends"
    # )
    # friends_list = [friend_status1, friend_status2, friend_status3]
    # all_friends = [db.session.add(friend) for friend in friends_list]
    users_list = User.query.all()
    users_list[0].friends.append(users_list[1])
    db.session.commit()
    return users_list[0].to_dict()
    # return all_friends


def undo_friends():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.friends RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM friends"))

    db.session.commit()
