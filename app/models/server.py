from app.models import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

# Join table for Servers and users to create memberships
server_memberships = db.Table(
    "server_memberships",  # Name of the table
    db.Model.metadata,
    db.Column("user_id", db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), primary_key=True),
    db.Column("server_id", db.Integer, db.ForeignKey(
        add_prefix_for_prod("servers.id")), primary_key=True),
    db.Column("status", db.String, nullable=False)
)


if environment == "production":
    server_memberships.schema = SCHEMA


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
    _owner_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    _created_at = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)

    # # Relationship
    owner = db.relationship(
        "User", back_populates="servers", single_parent=True)
    channels = db.relationship(
        "Channel", back_populates="server", cascade="all, delete-orphan")
    users = db.relationship(
        "User", secondary=server_memberships, back_populates="server_memberships")

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

    def check_owner(self, user):
        return user.id == self._owner_id


    def add_member(self, users, status):
        if isinstance(users, list):
            new_members = [server_memberships.insert().values(
                user_id=user.id, server_id=self.id, status=status) for user in users]
            [db.engine.execute(member) for member in new_members]
        elif isinstance(users, dict):
            new_member = server_memberships.insert().values(
                user_id=users["id"], server_id=self.id, status=status)
            db.engine.execute(new_member)
        else:
            new_member = server_memberships.insert().values(
                user_id=users.id, server_id=self.id, status=status)
            db.engine.execute(new_member)


    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self._owner_id,
            "icon_url": self._icon_url,
            "public": self._public,
            "name": self._name,
            "max_users": self._max_users,
            "description": self._description,
            "created_at": self._created_at,
            "owner": self.owner.to_safe_dict(),
            "channels": [channel.to_dict() for channel in self.channels],
            "users": [user.to_dict() for user in self.users],
        }

    def to_safe_dict(self):
        return {
            "id": self.id,
            "owner_id": self._owner_id,
            "icon_url": self._icon_url,
            "public": self._public,
            "name": self._name,
            "max_users": self._max_users,
            "description": self._description,
            "created_at": self._created_at,
        }
