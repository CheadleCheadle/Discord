from app.models import db, environment, SCHEMA, add_prefix_for_prod


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

    server = db.relationship(
        "Server", back_populates="channels")

    channel_messages = db.relationship(
        "ChannelMessage", back_populates="channel", cascade="all, delete-orphan"
    )

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

    @classmethod
    def create(cls, items):
        new_items = [cls(_server_id=item["_server_id"], _name=item["_name"],
                     _type=item["_type"], _max_users=item["_max_users"], _topic=item["_topic"]) for item in items]
        return new_items

    def to_safe_dict(self):
        return {
            'id': self.id,
            'server_id': self._server_id,
            'name': self._name,
            'type': self._type,
            'max_users': self._max_users,
            'topic': self._topic
        }

    def to_dict(self):
        return {
            'id': self.id,
            'server_id': self._server_id,
            'name': self._name,
            'type': self._type,
            'max_users': self._max_users,
            'topic': self._topic,
            'server': self.server.to_safe_dict(),
            'channel_messages': [message.to_safe_dict() for message in self.channel_messages]
        }
