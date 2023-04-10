from flask import Blueprint
from flask_login import login_required
from app.models import Server
from flask_login import current_user

server_routes = Blueprint('server', __name__)


@server_routes.route("/current")
#@login_required
def get_current_servers():
  """Query for all servers and returns them in a list of user dictionaries
  """
  servers = Server.query.filter(Server._owner_id==current_user.id).all()

  print({'servers': [server.to_dict() for server in servers]})
  return {'servers': [server.to_dict() for server in servers]}

@server_routes.route("/")
def get_all_servers():
  """Query for all servers and returns them in a list of user dictionaries
  """


  servers = Server.query.all()
  return f"{servers[0].owner}"
  #return {'servers': [server.to_dict() for server in servers]}

@server_routes.route('/<int:id>')
# @login_required
def get_one_server(id):
  """Query for all servers and returns them in a list of user dictionaries
  """
  server = Server.query.get(id)
  print(server.to_dict())
  return server.to_dict()





