from app.models.db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime


follows = db.Table(
        "follows", 
        db.Column("follower_id", db.Integer, db.ForeignKey("users.id")),
        db.Column("followed_id", db.Integer, db.ForeignKey("users.id"))
        )

# Join table for Servers and users to create memberships
server_memberships = db.Table(
    "server_memberships",  # Name of the table
    db.Model.metadata,
    db.Column("user_id", db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("server_id", db.Integer, db.ForeignKey(
        add_prefix_for_prod("servers.id")), primary_key=True)
)


class Server(db.Model):
    __tablename__ = "servers"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    _icon_url = db.Column(db.String, nullable=True)
    _public = db.Column(db.Boolean, nullable=False)
    _name = db.Column(db.String(100), nullable=False, unique=True)
    _max_users = db.Column(db.Integer, nullable=False)
    _description = db.Column(db.Text, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    _created_at = db.Column(db.DateTime, nullable=False,
                            default=datetime.now())

    # # Relationship
    #host = db.relationship("User", back_populates="servers")
    users = db.relationship(
        "User", secondary=server_memberships, back_populates="servers")

    @property
    def icon_url(self):
        return self._icon_url

    @icon_url.setter
    def icon_url(self, new_icon_url):
        self._icon_url = new_icon_url

    @property
    def public(self):
        return self._public

    @public.setter
    def public(self, new_type):
        self._public = new_type

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, new_name):
        self._name = new_name

    @property
    def max_users(self):
        return self._max_users

    @max_users.setter
    def max_users(self, new_max_users):
        self._max_users = new_max_users

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, new_description):
        self._description = new_description

    # def to_dict(self):
    #     return {
    #         "id": self.id,
    #         # "owner_id": self.owner_id,
    #         "icon_url": self.icon_url,
    #         "public": self.public,
    #         "name": self.name,
    #         "max_users": self.max_users,
    #         "description": self.description,
    #         "created_at": self.created_at
    #     }

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
    servers = db.relationship(
           "Server", secondary=server_memberships, back_populates="users")
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
