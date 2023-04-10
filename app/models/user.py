from app.models import db, environment, SCHEMA, add_prefix_for_prod, DirectMessage, ChannelMessage
from .server import server_memberships
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

friends = db.Table(
    "friends",
    db.Model.metadata,
    db.Column(
        "user1_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True
    ),
    db.Column(
        "user2_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True
    )
)


if environment == "production":
    friends.schema = SCHEMA


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
    active_status = db.Column(db.Boolean, unique=False, default=False)
    hashed_password = db.Column(db.String(255), nullable=False)

    # # Relatiomship
    servers = db.relationship(
        "Server", back_populates="owner", cascade="all, delete-orphan")
    direct_messages = db.relationship(
        "DirectMessage",
        secondary='direct_messages',
        primaryjoin=DirectMessage.user_id == id,
        secondaryjoin=DirectMessage.recipient_id == id,
        overlaps="recipient"
    )

    channel_messages = db.relationship(
        "ChannelMessage", back_populates='sender')

    friends = db.relationship(
        "User",
        secondary="friends",
        primaryjoin=friends.c.user1_id == id,
        secondaryjoin=friends.c.user2_id == id,
    )

    # received_messages = db.relationship(
    #     "DirectMessage", back_populates="recipient")

    server_memberships = db.relationship(
        "Server",
        secondary=server_memberships,
        back_populates="users",
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
            'email': self.email,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "photo_url": self.photo_url,
            "active_status": self.active_status
        }
