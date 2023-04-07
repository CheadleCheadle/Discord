from .db import db, environment, SCHEMA, add_prefix_for_prod


class Message(db.Model):
    __tablename__ = 'messages'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

    # datetime needs a default
    time_stamp = db.Column(db.DateTime, nullable=False)


class DirectMessages(db.Model, Message):
    __tablename__ = 'direct'
