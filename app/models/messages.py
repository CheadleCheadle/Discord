from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Message(db.Model):
    __abstract__ = True
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)
    # datetime needs a default
    _time_stamp = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)

    @property
    def _time_stamp(self):
        return self._time_stamp

    @_time_stamp.setter
    def _time_stamp(self, val):
        raise Exception("Cannot alter timestamp")

    def __repr__(self):
        return f"{self._time_stamp}: Message from user {self.user_id}: {self.content}"


class DirectMessage(Message):
    __tablename__ = 'direct_messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    recipient_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("users.id")), nullable=False)

    recipient = db.relationship("User", back_populates="direct_messages")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self.content,
            "recipient_id": self.recipient_id,
            "time_stamp": self._time_stamp
        }

    @classmethod #Seeder method
    def create(cls, items):
        new_items = [cls(user_id=item["user_id"], content=item["content"], recipient_id=item["recipient_id"], _time_stamp=item["_time_stamp"], pokemon_id=item["pokemon_id"])
                     for item in items]
        return new_items

    def __repr__(self):
        return f"Direct message from user {self.user_id} to user {self.recipient_id}: {self.content}"


class ChannelMessage(Message):
    __tablename__ = 'channel_messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    channel_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("channels.id")), nullable=False)

    channel = db.relationship("Channel", back_populates="channel_messages")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "content": self.content,
            "channel_id": self.channel_id,
            "time_stamp": self._time_stamp
        }

    @classmethod #seeder method
    def create(cls, items):
        new_items = [cls(user_id=item["user_id"], content=item["content"], channel_id=item["channel_id"], _time_stamp=item["_time_stamp"], pokemon_id=item["pokemon_id"])
                     for item in items]
        return new_items

    def __repr__(self):
        return f"Channel {self.channel_id} message from user {self.user_id}: {self.content}"
