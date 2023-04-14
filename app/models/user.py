from app.models import db, environment, SCHEMA, add_prefix_for_prod, DirectMessage, ChannelMessage
from .server import server_memberships
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from .messages import DirectMessage

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
    ),
    db.Column(
        "status",
        db.String,
        nullable=False
    )
)

if environment == "production":
    friends.schema = SCHEMA


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    firstname = db.Column(db.String(40), nullable=False)
    lastname = db.Column(db.String(40), nullable=False)
    photo_url = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    active_status = db.Column(db.Boolean, unique=False, default=False)
    hashed_password = db.Column(db.String(255), nullable=False)

    # Relationships
    servers = db.relationship(
        "Server", back_populates="owner", cascade="all, delete-orphan")

    if environment == "production":

        dms = db.relationship(
            "DirectMessage",
            secondary=f'{SCHEMA}.direct_messages',
            primaryjoin=DirectMessage.user_id == id,
            secondaryjoin=DirectMessage.recipient_id == id,
            overlaps="recipient"
        )
    else:

        dms = db.relationship(
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
        primaryjoin=(friends.c.user1_id == id),
        secondaryjoin=(friends.c.user2_id == id),
        backref=db.backref("friend", lazy="dynamic"),
        lazy="dynamic"
    )

    # friends_with_me = db.relationship(
    #     "User",
    #     secondary="friends",
    #     primaryjoin=friends.c.user2_id == id,
    #     secondaryjoin=friends.c.user1_id == id,
    #     )

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

    # To handle recursive calls between a server getting info for its owner which causes its owner to get info for its servers. Hence, recursive loop

    def add_friend(self, friend_lst, status):
        if isinstance(friend_lst, list):
            new_friendships = [friends.insert().values(
                user1_id=self.id, user2_id=friend.id, status=status) for friend in friend_lst]
            [db.engine.execute(friend) for friend in new_friendships]
        else:
            new_friendship = friends.insert().values(
                user1_id=self.id, user2_id=friend_lst.id, status=status)
            db.engine.execute(new_friendship)


    def to_safe_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "photo_url": self.photo_url,
            "active_status": self.active_status,
        }

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "photo_url": self.photo_url,
            "active_status": self.active_status,
            "servers": [server.to_safe_dict() for server in self.servers],
            "direct_messages": [dm.to_dict() for dm in self.dms],
            "channel_messages": [message.to_dict() for message in self.channel_messages],
            "friends": [x for n in ([friend.to_safe_dict() for friend in self.friend.all()],[friend.to_safe_dict() for friend in self.friends]) for x in n]

        }
