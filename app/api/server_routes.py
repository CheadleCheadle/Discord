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


@server_routes.route('/<int:server_id>/channels/new', methods=['POST'])
@login_required
def create_new_channel_by_server_id(server_id):
    form = ChannelForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel = Channel(
            _server_id=server_id,
            _name=form.data["name"],
            _type=form.data["type"],
            _max_users=form.data["max_users"],
            _topic=form.data["topic"]
        )
        db.session.add(channel)
        db.session.commit()

        return channel.to_safe_dict()
    return {"error": "error occurred"}


@server_routes.route('/<int:server_id>/channels')
@login_required
def get_all_server_channels(server_id):
    all_channels = Channel.query.filter(Channel._server_id == server_id)
    return {"channel": [channel.to_safe_dict() for channel in all_channels]}
