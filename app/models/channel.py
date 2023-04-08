from app.models.db import db, environment, SCHEMA, add_prefix_for_prod

# Join table for creating channel members
channel_subscribers = db.Table(
    "channel_subscribers",
    db.Column(
        "user_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        primary_key=True),
    db.Column(
        "channel_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("channels.id")),
        primary_key=True)
),


class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    server_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("servers.id")), nullable=False)
    name = db.Column(db.String(40), nullable=False)
    type = db.Column(db.String(40), nullable=False)
    max_users = db.Column(db.Integer)
    topic = db.Column(db.String(100), nullable=False)

    server = db.relationship(
        "Server",
        back_populates="channels"
    )

    channel_messages = db.relationship(
        "ChannelMessage", back_populates="channels"
    )
    subscribers = db.relationship(
        "Channel",
        secondary="channel_subscribers"
    )

    @property
    def name(self):
        return self.name

    @name.setter
    def name(self, name):
        self.name = name

    @property
    def type(self):
        return self.type

    @type.setter
    def type(self, type):
        self.type = type

    @property
    def max_users(self):
        return self.max_users

    @max_users.setter
    def max_users(self, max_users):
        self.max_users = max_users

    @property
    def topic(self):
        return self.topic

    @topic.setter
    def topic(self, topic):
        self.topic = topic

    def to_dict(self):
        return {
            'id': self.id,
            'server_id': self.server_id,
            'name': self.name,
            'type': self.type,
            'max_users': self.max_users,
            'topic': self.topic
        }
