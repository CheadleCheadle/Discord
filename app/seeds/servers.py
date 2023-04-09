from app.models import db, Server, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


# Adds a demo server, you can add other servers here if you want
def seed_servers():
    server1 = Server(
        _owner_id=1, _icon_url='https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png', _public=True, _name="aA Open", _max_users=30, _description="Welcome to App Academy Nov 2022 Cohort")
    server2 = Server(
        _owner_id=2, _icon_url='https://media.discordapp.net/attachments/676180932809588767/1048993307528798288/bpwelcome22.jpg?width=1431&height=876', _public=False, _name="BLACK PINK", _max_users=40, _description="Welcome to BLACK PINK fans group")
    server3 = Server(
        _owner_id=3, _icon_url='https://www.shutterstock.com/shutterstock/photos/434536597/display_1500/stock-vector-vector-illustration-silhouette-of-a-climber-isolated-hiker-on-white-background-434536597.jpg', _public=False, _name="Random", _max_users=40, _description="Welcome to Random fans group")

    server4 = Server(
        _owner_id=1, _icon_url='https://denverurban.net/wp-content/uploads/2014/05/gourmet-food.jpg', _public=False, _name="Recipes Sharing", _max_users=35, _description="Welcome to Recipes Sharing Group")
    server5 = Server(
        _owner_id=2, _icon_url='https://www.thexboxhub.com/wp-content/uploads/2013/11/minecraftheader.jpg', _public=True, _name="Minecraft", _max_users=45, _description="Welcome to Minecraft group")

    server6 = Server(
        _owner_id=3, _icon_url='https://www.shutterstock.com/shutterstock/photos/434536597/display_1500/stock-vector-vector-illustration-silhouette-of-a-climber-isolated-hiker-on-white-background-434536597.jpg', _public=False, _name="Dog lover", _max_users=55, _description="Welcome to Dog lover group")

    all_servers = [server1, server2, server3, server4, server5, server6]
    add_servers = [db.session.add(server) for server in all_servers]

    db.session.commit()
    return add_servers


def undo_servers():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM servers"))

    db.session.commit()
