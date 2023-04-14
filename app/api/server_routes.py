from flask import Blueprint, redirect, render_template, request
from flask_login import current_user, login_required
from app.models import db, Server, Channel
from app.forms import ServerForm, ChannelForm
import json

server_routes = Blueprint('server', __name__)
default_image = "https://d1lss44hh2trtw.cloudfront.net/assets/article/2022/12/01/discord-offer-new-server-subscription-90-10-revenue-split_feature.jpg"

@server_routes.route("/current")
# @login_required
def get_current_servers():
    """Query for all servers and returns them in a list of user dictionaries
    """
    servers = Server.query.filter(Server._owner_id == current_user.id).all()

    #print({'servers': [server.to_dict() for server in servers]})
    return {'servers': [server.to_dict() for server in servers]}

#Get all servers
@server_routes.route("/")
def get_all_servers():
    """Query for all servers and returns them in a list of user dictionaries """

    servers = Server.query.all()
    # return f"{servers[0].owner}"
    return {'servers': [server.to_dict() for server in servers]}, 200



#Create new server
@login_required
@server_routes.route("/new", methods=["POST"])
def add_new_server():
    """returns a new post form on get requests,
    validates and saves the new resource on post"""

    form = ServerForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    # print(form.author.choices)
    # query for data if needed in the form

    if form.validate_on_submit():
        #Set values to be default upon creation. This way, it matches the real discord process.
      params={ "_icon_url": form.data["icon_url"] or default_image,
            "_public": True,
            "_name": form.data["name"],
            "_max_users": 100,
            "_description": "",
            "_owner_id": current_user.id
              }

      new_server =Server(**params)
      print(new_server)
      try:
        db.session.add(new_server)
        db.session.commit()
        return new_server.to_dict(), 201
      except Exception as e:
        return {"errors": str(e)}, 500

    return {"errors": form.errors }, 400
#Update server
@login_required
@server_routes.route('/<int:id>', methods=["PUT"])
def edit_a_server(id):
    """returns a new post form on get requests,
    validates and saves the new resource on post"""

    form = ServerForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    # print(form.author.choices)
    # query for data if needed in the form

    if form.validate_on_submit():
      server=Server.query.get(id)

      if server.check_owner(current_user):

        server._icon_url = form.data["icon_url"]
        server._public = form.data["public"]
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

    return {"errors": form.errors }, 400

#Get single server
@server_routes.route('/<int:id>')
#@login_required
def get_one_server(id):
  """Query for one server and returns them in a dictionary"""

  server = Server.query.get(id)
  if(server==None):
    return {"errors":"Film not found"}, 404
  return server.to_dict(), 200

#Delete Server
@server_routes.route('/<int:id>', methods=["DELETE"])
@login_required
def delete_one_server(id):
  """Query for all servers and returns them in a list of user dictionaries
  """

  server = Server.query.get(id)
  if(server==None):
    return {"errors":"File not found"}, 404
  elif server.check_owner(current_user):
    try:
      db.session.delete(server)
      db.session.commit()
      return {"Message": f"Successfully deleted {server._name}!"}, 200
    except Exception as e:
      return {"errors": str(e)}, 500
  else:
      return {"Message": "Forbidden"}, 400

#Create new channel in server
#Get all channels for server
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
    return {"channel": [channel.to_dict() for channel in all_channels]}





# JOIN SERVER
@server_routes.route('/join/<int:server_id>', methods=['POST'])
@login_required
def join_Server(server_id):
    data = json.loads(request.data)
    user = data["user"]
    status = data["status"]
    print('-------------',data, user, status)
    server = Server.query.get(server_id)
    print('IM THE SERVER', server.to_safe_dict())
    new_server_membership = server.add_member(user, status)
    return server.to_dict()
