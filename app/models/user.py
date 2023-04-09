from app.models.db import db, environment, SCHEMA
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
# from .server import server_memberships

follows = db.Table(
        "follows", 
        db.Column("follower_id", db.Integer, db.ForeignKey("users.id")),
        db.Column("followed_id", db.Integer, db.ForeignKey("users.id"))
        )


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    firstname = db.Column(db.String(40), nullable=False)
    lastname = db.Column(db.String(40), nullable=False)
    photo_url = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    active_status = db.Column(db.Boolean)
    hashed_password = db.Column(db.String(255), nullable=False)
    # Relationship
    #servers = db.relationship(
            #"Server", secondary=server_memberships, back_populates="users")
    direct_messages = db.relationship(
            "DirectMessage", back_populates="users"
            )
    followers = db.relationship(
            "User", 
            secondary=follows,
            primaryjoin=(follows.c.follower_id == id),
            secondaryjoin=(follows.c.followed_id == id),
            backref=db.backref("following", lazy="dynamic"),
            lazy="dynamic"
            )

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
                'id': self.id,
                'username': self.username,
                'email': self.email
                }
