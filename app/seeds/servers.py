from app.models.db import db, Server, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


# Adds a demo server, you can add other servers here if you want
def seed_servers():
    server1 = Server(
        owner_id=1, icon_url='https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png', type=True, name="aA Open", max_users=30, description="Welcome to App Academy Nov 2022 Cohort", created_at=datetime.utcnow())
    server2 = Server(
        owner_id=2, icon_url='https://media.discordapp.net/attachments/676180932809588767/1048993307528798288/bpwelcome22.jpg?width=1431&height=876', type=False, name="BLACK PINK", max_users=40, description="Welcome to BLACK PINK fans group", created_at=datetime.utcnow())
    server3 = Server(
        owner_id=3, icon_url='https://www.shutterstock.com/shutterstock/photos/434536597/display_1500/stock-vector-vector-illustration-silhouette-of-a-climber-isolated-hiker-on-white-background-434536597.jpg', type=True, name="Hiker", max_users=50, description="Welcome to Moutain Hiker group", created_at=datetime.utcnow())

    server4 = Server(
        owner_id=1, icon_url='https://denverurban.net/wp-content/uploads/2014/05/gourmet-food.jpg', type=False, name="Recipes Sharing", max_users=35, description="Welcome to Recipes Sharing Group", created_at=datetime.utcnow())
    server5 = Server(
        owner_id=2, icon_url='https://www.thexboxhub.com/wp-content/uploads/2013/11/minecraftheader.jpg', type=True, name="Minecraft", max_users=45, description="Welcome to Minecraft group", created_at=datetime.utcnow())

    server6 = Server(
        owner_id=3, icon_url='https://www.shutterstock.com/shutterstock/photos/434536597/display_1500/stock-vector-vector-illustration-silhouette-of-a-climber-isolated-hiker-on-white-background-434536597.jpg', type=False, name="Dog lover", max_users=55, description="Welcome to Dog lover group", created_at=datetime.utcnow())

    all_servers = [server1, server2, server3, server4, server5, server6]
    add_servers = [db.session.add(server) for server in all_servers]

    db.session.commit()
    return add_servers


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_servers():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.servers RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM servers"))

    db.session.commit()
