from operator import add
from app.models import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Message(db.Model):
    __abstract__ = True

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    _content = db.Column(db.Text, nullable=False)
    _time_stamp = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)

    @property
    def content(self):
        return self._content

    @content.setter
    def content(self, val):
        self._content = val

    @property
    def time_stamp(self):
        return self._time_stamp

    @time_stamp.setter
    def time_stamp(self, val):
        raise Exception("Cannot alter timestamp")


class DirectMessage(Message):
    __tablename__ = 'direct_messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")),  nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)

    sender = db.relationship(
        "User", foreign_keys=[user_id], back_populates="dms")
    recipient = db.relationship(
        "User", foreign_keys=[recipient_id], back_populates="dms")

    def to_safe_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self.content,
            "recipient_id": self.recipient_id,
            "time_stamp": self._time_stamp
        }

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self.content,
            "recipient_id": self.recipient_id,
            "time_stamp": self._time_stamp,
            "sender": self.sender.to_safe_dict(),
            "recipient": self.recipient.to_safe_dict()
        }

    @classmethod  # Seeder method
    def create(cls, items):
        new_items = [cls(user_id=item["user_id"], content=item["_content"], recipient_id=item["recipient_id"])
                     for item in items]
        return new_items

    def __repr__(self):
        return f"Direct message from user {self.user_id} to user {self.recipient_id}: {self.content}"


if environment == "production":
    DirectMessage.schema = SCHEMA


class ChannelMessage(Message):
    __tablename__ = 'channel_messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    channel_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("channels.id")), nullable=False)

    sender = db.relationship("User", back_populates='channel_messages')
    channel = db.relationship("Channel", back_populates="channel_messages")

    @classmethod  # seeder method
    def create(cls, items):
        new_items = [cls(user_id=item["user_id"], content=item["_content"], channel_id=item["channel_id"])
                     for item in items]
        return new_items

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self._content,
            "channel_id": self.channel_id,
            "time_stamp": self._time_stamp,
            "sender": self.sender.to_safe_dict(),
            "channel": self.channel.to_safe_dict()
        }

    def to_safe_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self._content,
            "channel_id": self.channel_id,
            "time_stamp": self._time_stamp,
        }

    def __repr__(self):
        return f"Channel {self.channel_id} message from user {self.user_id}: {self.content}"


if environment == "production":
    ChannelMessage.schema = SCHEMA
