from .db import db, environment, SCHEMA, add_prefix_for_prod


class Server(db.Modal):
    __tablename__ = "servers"

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)

    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id"), nullable=False))

    icon_url = db.Column(db.String, nullable=True)

    type = db.Column(db.Boolean, nullable=False)

    name = db.Column(db.String(100), nullable=False, unique=True)

    max_users = db.Column(db.Integer, nullable=False)

    topic = db.Column(db.String, nullable=True)

    description = db.Column(db.Text, nullable=False)

    created_at = db.Column(db.DateTime, nullable=False)

    @property
    def icon_url(self):
        return self.icon_url

    @icon_url.setter
    def icon_url(self, new_icon_url):
        self.icon_url = new_icon_url

    @property
    def type(self):
        return self.type

    @type.setter
    def type(self, new_type):
        self.type = new_type

    @property
    def name(self):
        return self.name

    @name.setter
    def name(self, new_name):
        self.name = new_name

    @property
    def max_users(self):
        return self.max_users

    @max_users.setter
    def max_users(self, new_max_users):
        self.max_users = new_max_users

    @property
    def topic(self):
        return self.topic

    @topic.setter
    def topic(self, new_topic):
        self.topic = new_topic

    @property
    def description(self):
        return self.description

    @description.setter
    def description(self, new_description):
        self.description = new_description

    def to_dict(self):
        return {
                "id": self.id,
                "owner_id": self.owner_id,
                "icon_url": self.icon_url,
                "type": self.type,
                "name": self.name,
                "max_users": self.max_users,
                "topic": self.topic,
                "description": self.description,
                "created_at": self.created_at
        }



