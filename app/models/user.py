from app.models import db, environment, SCHEMA, add_prefix_for_prod, DirectMessage, ChannelMessage, Server, server_memberships
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from random import randint

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

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    firstname = db.Column(db.String(40), nullable=False)
    lastname = db.Column(db.String(40), nullable=False)
    photo_url = db.Column(db.String(255))
    email = db.Column(db.String(255), nullable=False, unique=True)
    active_status = db.Column(db.Boolean, unique=False, default=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(4), unique=True)
    about = db.Column(db.String, nullable=True, default="Hi There!")
    created_at = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)
    # Relationships
    servers = db.relationship(
        "Server", back_populates="owner", cascade="all, delete-orphan")


    def __init__(self, *args, **kwargs):
        super(User, self).__init__(*args, **kwargs)
        self.code = self.generate_code()

    def generate_code(self):
        while True:
            code = ''.join([str(randint(0, 9)) for _ in range(4)])
            if not User.query.filter_by(code=code).first():
                return code



    if environment == "production":

        direct_messages = db.relationship(
            "DirectMessage",
            secondary=f'{SCHEMA}.direct_messages',
            primaryjoin=DirectMessage.user_id == id,
            secondaryjoin=DirectMessage.recipient_id == id,
            overlaps="recipient"
        )
    else:

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
        primaryjoin=(friends.c.user1_id == id),
        secondaryjoin=(friends.c.user2_id == id),
        backref=db.backref("friend", lazy="dynamic"),
        lazy="dynamic"
    )


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
            'code': self.code,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "photo_url": self.photo_url,
            "active_status": self.active_status,
            "about": self.about,
            "created_at": self.created_at
        }

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            "firstname": self.firstname,
            "lastname": self.lastname,
            'code': self.code,
            "photo_url": self.photo_url,
            "active_status": self.active_status,
            "servers": [server.to_safe_dict() for server in self.servers],
            "direct_messages": [dm.to_dict() for dm in self.direct_messages],
            "channel_messages": [message.to_dict() for message in self.channel_messages],
            "friends": [x for n in ([friend.to_safe_dict() for friend in self.friend.all()], [friend.to_safe_dict() for friend in self.friends]) for x in n],
            "about": self.about,
            "created_at": self.created_at
        }
