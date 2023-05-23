from flask import Blueprint, redirect, render_template, request
from flask_login import current_user, login_required
from app.models import db, Server, Channel, User, server_memberships
from app.forms import ServerForm, ChannelForm
from .memberships import get_all_memberships
import json

server_routes = Blueprint('server', __name__)
default_image = "https://d1lss44hh2trtw.cloudfront.net/assets/article/2022/12/01/discord-offer-new-server-subscription-90-10-revenue-split_feature.jpg"


@server_routes.route("/current")
# @login_required
def get_current_servers():
    """Query for all servers and returns them in a list of user dictionaries
    """
    # servers = Server.query.filter(Server._owner_id == current_user.id).all()
    allServers = db.session.query(Server).join(server_memberships).filter(
        server_memberships.c.status != "Pending")
    server = new_server.to_dict()
    server["memberships"] = get_all_memberships(new_server.id)
    dicted = [server.to_dict() for server in allServers]
    for theServer in dicted:
        theServer["memberships"] = get_all_memberships(theServer["id"])
    return {'servers': dicted}

# Get all servers


@server_routes.route("/")
def get_all_servers():
    """Query for all servers and returns them in a list of user dictionaries """

    servers = Server.query.all()
    dicted = [server.to_dict() for server in servers]
    for server in dicted:
        server["memberships"] = get_all_memberships(server["id"])


    return {'servers': [server.to_dict() for server in servers]}, 200


# Create new server
@login_required
@server_routes.route("/new", methods=["POST"])
def add_new_server():
    """returns a new post form on get requests,
    validates and saves the new resource on post"""

    form = ServerForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    # query for data if needed in the form

    if form.validate_on_submit():
        # Set values to be default upon creation. This way, it matches the real discord process.
        params = {"_icon_url": form.data["icon_url"] or default_image,
                  "_public": form.data["public_"],
                  "_name": form.data["name"],
                  "_max_users": form.data["max_users"],
                  "_description": form.data["description"],
                  "_owner_id": current_user.id
                  }

        new_server = Server(**params)
        try:
            db.session.add(new_server)
            db.session.commit()
            curr_user = User.query.get(current_user.id)
            new_server.add_member(curr_user, "Host")
            new_membership = db.session.query(server_memberships).join(Server).filter(server_memberships.c.user_id == curr_user.id, server_memberships.c.server_id == new_server.id).first()
            return {"new_server":new_server.to_dict(), "new_membership": {"status": new_membership.status, "userId": new_membership.user_id, "serverId": new_membership.server_id}}, 201
        except Exception as e:
            return {"errors": str(e)}, 500


@login_required
@server_routes.route('/<int:id>', methods=["PUT"])
def edit_a_server(id):
    """returns a new post form on get requests,
    validates and saves the new resource on post"""

    form = ServerForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    # query for data if needed in the form

    if form.validate_on_submit():
        server = Server.query.get(id)

        if server.check_owner(current_user):

            server._icon_url = form.data["icon_url"]
            server._public = form.data["public_"]
            server._name = form.data["name"]
            server._max_users = form.data["max_users"]
            server._description = form.data["description"]

            try:
                db.session.commit()
                return server.to_dict(), 201
            except Exception as e:
                return {"errors": str(e)}, 500
        else:
            return {"Message": "Forbidden"}, 403
    return {"errors": form.errors}, 400

# Get single server


@server_routes.route('/<int:id>')
# @login_required
def get_one_server(id):
    """Query for one server and returns them in a dictionary"""

    server = Server.query.get(id)
    if (server == None):
        return {"errors": "Film not found"}, 404
    return server.to_dict(), 200





# Delete Server


@server_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_one_server(id):
    """Query for all servers and returns them in a list of user dictionaries
    """

    server = Server.query.get(id)
    if (server == None):
        return {"errors": "File not found"}, 404
    elif server.check_owner(current_user):
        try:
            db.session.delete(server)
            db.session.commit()
            return {"Message": f"Successfully deleted {server._name}!"}, 200
        except Exception as e:
            return {"errors": str(e)}, 500
    else:
        return {"Message": "Forbidden"}, 400

# Create new channel in server
# Get all channels for server


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
            _topic=form.data["topic"],
            _com_type=form.data["com_type"]
        )
        db.session.add(channel)
        db.session.commit()

        return channel.to_safe_dict()
    return {"error": "error occurred"}


@server_routes.route('/<int:server_id>/channels')
@login_required
def get_all_server_channels(server_id):
    all_channels = Channel.query.filter(Channel._server_id == server_id)
    return {"channel": [channel.to_dict() for channel in all_channels]}


# JOIN SERVER
@server_routes.route('/join/<int:server_id>', methods=['POST'])
@login_required
def join_Server(server_id):
    data = json.loads(request.data)
    user = data["user"]
    status = data["status"]
    server = Server.query.get(server_id)
    server.add_member(user, status)
    membership = db.session.query(
        server_memberships).filter(server_memberships.c.user_id == user_id, server_memberships.c.server_id == server_id).first()
    return {"status": membership.status, "userId": membership.user_id, "serverId": membership.server_id},  201


@server_routes.route("/<int:server_id>/membership", methods=['GET', 'DELETE', "POST"])
@login_required
def join_server(server_id):
    server = Server.query.get(server_id)

    if request.method == 'POST':
        data = json.loads(request.data)
        add_user_id = data["userId"]
        new_member = User.query.get(add_user_id)
        post_membership = db.session.execute(
            server_memberships.update().where(server_memberships.c.user_id == add_user_id).where(server_memberships.c.server_id == server_id).values(status="Member"))
        db.session.commit()

        return {"status": 'Member', "userId": new_member.id, "serverId": server.id},  201

    user_id = current_user.id
    user = User.query.get(user_id)

    membership = db.session.query(
        server_memberships).filter(server_memberships.c.user_id == user_id, server_memberships.c.server_id == server_id).first()

    if request.method == 'DELETE':
        if not server or not user or not membership:
            return {"errors": "Resources not found."}, 404
        host_bool = server.owner_id == user.id
        if (host_bool):
            return {"errors": "Permission Denied"}, 401
        user_bool = membership.user_id == user.id
        if not (user_bool):
            return {"errors": "Permission Denied"}, 401
        server.users.remove(user)
        db.session.commit()
        return {"Success": "Membership deleted."}, 202

    if membership:
        return {'error': "Membership already exists"}, 409

    server.add_member(user, "Pending")
    db.session.commit()
    return {"status": 'Pending', "userId": user_id, "serverId": server_id},  201
