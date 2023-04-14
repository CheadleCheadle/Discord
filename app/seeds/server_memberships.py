from app.models import db, friends, environment, SCHEMA, Server, User
from sqlalchemy.sql import text


def seed_server_memberships():

    servers_list = Server.query.all()
    users_list = User.query.all()
    servers_list[0].add_member(users_list, 'Member')
    servers_list[1].add_member(users_list[2], "Member")
    #servers_list[0].add_member(users_list[2], "pending")
    db.session.commit()


def undo_server_memberships():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.server_memberships RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM server_memberships"))

    db.session.commit()
