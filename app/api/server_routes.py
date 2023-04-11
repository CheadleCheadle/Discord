from flask import Blueprint, request
from flask_login import login_required
from app.models import Server, Channel, db
from flask_login import current_user
from ..forms import ChannelForm

server_routes = Blueprint('server', __name__)


@server_routes.route("/current")
# @login_required
def get_current_servers():
    """Query for all servers and returns them in a list of user dictionaries
    """
    servers = Server.query.filter(Server._owner_id == current_user.id).all()

    print({'servers': [server.to_dict() for server in servers]})
    return {'servers': [server.to_dict() for server in servers]}


@server_routes.route("/")
def get_all_servers():
    """Query for all servers and returns them in a list of user dictionaries
    """

    servers = Server.query.all()
    # return f"{servers[0].owner}"
    return {'servers': [server.to_dict() for server in servers]}


@server_routes.route('/<int:id>')
# @login_required
def get_one_server(id):
    """Query for all servers and returns them in a list of user dictionaries
    """
    server = Server.query.get(id)
    return server.to_dict()


@server_routes.route('/<int:server_id>/channels/new', methods=['GET', 'POST'])
@login_required
def create_new_channel_by_server_id(server_id):
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel = Channel(
            _server_id=server_id,
            _name=form.name.data,
            _type=form.type.data,
            _max_users=form.max_users.data,
            _topic=form.topic.data
        )
        db.session.add(channel)
        db.session.commit()

        # need to change this for single channel
        new_channel = Channel.query.filter(
            Channel._server_id == form.server_id.data,
            Channel._name == form.name.data,
            Channel._type == form.type.data,
            Channel._max_users == form.max_users.data,
            Channel._topic == form.topic.data
        ).all()
        return [channel.to_safe_dict() for channel in new_channel]
    return {"error": "error occurred"}


@server_routes.route('/<int:server_id>/channels')
@login_required
def get_all_server_channels(server_id):
    all_channels = Channel.query.filter(Channel._server_id == server_id)
    return {"channel": [channel.to_safe_dict() for channel in all_channels]}
