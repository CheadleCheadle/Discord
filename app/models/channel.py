from app.models.db import db, environment, SCHEMA, add_prefix_for_prod

# # Join table for creating channel members
# channel_subscribers = db.Table(
#     "channel_subscribers",
#     db.Column(
#         "user_id",
#         db.Integer,
#         db.ForeignKey(add_prefix_for_prod("users.id")),
#         primary_key=True),
#     db.Column(
#         "channel_id",
#         db.Integer,
#         db.ForeignKey(add_prefix_for_prod("channels.id")),
#         primary_key=True)
# ),


class Channel(db.Model):
    __tablename__ = 'channels'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    _server_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod("servers.id")), nullable=False)
    _name = db.Column(db.String(40), nullable=False)
    _type = db.Column(db.String(40), nullable=False)
    _max_users = db.Column(db.Integer)
    _topic = db.Column(db.String(100), nullable=False)

    server = db.relationship("Server", back_populates="channels")

    channel_messages = db.relationship(
        "ChannelMessage", back_populates="channel"
    )

    # subscribers = db.relationship(
    #     "Channel",
    #     secondary="channel_subscribers"
    # )

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, val):
        self._name = val

    @property
    def type(self):
        return self._type

    @type.setter
    def type(self, val):
        self._type = val

    @property
    def max_users(self):
        return self._max_users

    @max_users.setter
    def max_users(self, val):
        self._max_users = val

    @property
    def topic(self):
        return self._topic

    @topic.setter
    def topic(self, val):
        self._topic = val

    def to_dict(self):
        return {
            'id': self.id,
            'server_id': self._server_id,
            'name': self._name,
            'type': self._type,
            'max_users': self._max_users,
            'topic': self._topic
        }
