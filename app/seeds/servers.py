from app.models import db, Server, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


# Adds a demo server, you can add other servers here if you want
def seed_servers():
    server1 = Server(
        _owner_id=1, _icon_url='https://upload.wikimedia.org/wikipedia/commons/7/7e/Appacademylogo.png', _public=True, _name="aA Open", _max_users=30, _description="Welcome to App Academy Nov 2022 Cohort")
    server2 = Server(
        _owner_id=2, _icon_url='https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png', _public=False, _name="Midjourney", _max_users=40, _description="Welcome to Midjourney")
    server3 = Server(
        _owner_id=3, _icon_url='https://i1.sndcdn.com/avatars-5kMd7CfkeKR970IM-HVYgHQ-t500x500.jpg', _public=False, _name="OpenAI", _max_users=40, _description="Welcome to OpenAI")

    server4 = Server(
        _owner_id=1, _icon_url='https://global-uploads.webflow.com/63994dae1033718bee6949ce/63c31b852405e72353d27e34_t0QxIp45_400x400.jpg', _public=False, _name="BlueWillow", _max_users=35, _description="Welcome to BlueWillow")
    server5 = Server(
        _owner_id=2, _icon_url='https://www.thexboxhub.com/wp-content/uploads/2013/11/minecraftheader.jpg', _public=True, _name="Minecraft", _max_users=45, _description="Welcome to Minecraft")

    server6 = Server(
        _owner_id=3, _icon_url='https://upload.wikimedia.org/wikipedia/commons/3/32/A_photograph_of_an_astronaut_riding_a_horse_2022-08-28.png', _public=False, _name="Stable Diffusion", _max_users=55, _description="Welcome to Stable Diffusion")

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
