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
    server7 = Server(
        _owner_id=1, _icon_url="https://image.api.playstation.com/vulcan/ap/rnd/202010/1407/2JSde8PFCF6B4nO2EECrcR1m.png", _public=True, _name="Deep Rock Galactic", _max_users=50, _description="Welcome to Deep Rock Galactic"
    )
    server8 = Server(
        _owner_id=2, _icon_url="https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Flag_of_France.svg/1200px-Flag_of_France.svg.png", _public=True, _name="French Server", _max_users=50, _description="Bienvenue sur le serveur français"
    )
    server9 = Server(
        _owner_id=1, _icon_url="https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Flag_of_Germany.svg/1200px-Flag_of_Germany.svg.png", _public=True, _name="German Server", _max_users=50, _description="Willkommen auf dem Deutch Server"
    )
    server10 = Server(
        _owner_id=1, _icon_url="https://m.media-amazon.com/images/I/313g+A58k3L._AC_UF894,1000_QL80_.jpg", _public=True, _name="Mexican Server", _max_users=50, _description="Bienvenido al servidor mexicano"
    )
    all_servers = [server1, server2, server3, server4, server5, server6, server7, server8, server9, server10]
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
