from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        username='Demo', firstname='Demo', lastname='DEMO', photo_url="https://pbs.twimg.com/media/DUR7PaeXUAM_Tuz.png", email='demo@aa.io', password='password')
    marnie = User(
        username='marnie', firstname='Marnie', lastname='MARNIE', photo_url="https://wallpapers-clan.com/wp-content/uploads/2022/11/cute-frog-pfp-2.jpg", email='marnie@aa.io', password='password')
    bobbie = User(
        username='bobbie', firstname='Bobbie', lastname='BOBBIE', photo_url="https://www.mintface.xyz/content/images/2021/08/QmTndiF423kjdXsNzsip1QQkBQqDuzDhJnGuJAXtv4XXiZ-1.png", email='bobbie@aa.io', password='password')

    mark = User(
        username='mark', firstname='Mark', lastname='Walter', photo_url="https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg", email='mark@aa.io', password='password')

    sarah = User(
        username='sarah', firstname='Sarah', lastname='johnson', photo_url="https://images.statusfacebook.com/profile_pictures/most-beautiful-dp-for-whatsapp/most-beautiful-profile-pictures-for-facebook-05.jpg", email='sarah@aa.io', password='password')

    juicy= User(
        username='GC', firstname='Gian', lastname='Carlo', photo_url="https://media.npr.org/assets/img/2019/01/02/gettyimages-1058306908-0b38ff8a90d7bf88fea3133d8b72498665f63e12-s1100-c50.jpg", email='gian@aa.io', password='password')

    ashley = User(
        username='ashley', firstname='Ashley', lastname='Lallum', photo_url="https://xf-assets.pokecharms.com/data/attachment-files/2015/10/236933_Charmander_Picture.png", email='ashley@aa.io', password='password')
    david = User(
        username='SPACEMAN', firstname='David', lastname='Rogers', photo_url="https://m.media-amazon.com/images/I/7176aBLK8BS._AC_UF894,1000_QL80_.jpg", email='david@aa.io', password='password')

    grant = User(
        username='Cheadle', firstname='Grant', lastname='Cheadle', photo_url="https://i.pinimg.com/280x280_RS/b1/93/73/b1937337340da014be77ab4e5202663f.jpg", email='grant@aa.io', password='password')

    tony = User(
        username='tknee2', firstname='Tony', lastname='Zheng', photo_url="https://art.pixilart.com/13e07bd455dcf46.png", email='tony@aa.io', password='password')

    helen = User(
        username='chunni', firstname='helen', lastname='chunni', photo_url="https://i.quotev.com/e72wyjmuzkgq.jpg", email='helen@aa.io', password='password')









    person = db.session.add(demo)
    person2 = db.session.add(marnie)
    person2 = db.session.add(bobbie)
    person3 = db.session.add(mark)
    person4 = db.session.add(sarah)
    person5 = db.session.add(juicy)
    db.session.add(ashley)
    db.session.add(david)
    db.session.add(grant)
    db.session.add(tony)
    db.session.add(helen)
    person2 = db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
