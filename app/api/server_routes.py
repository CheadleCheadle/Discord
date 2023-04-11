from flask import Blueprint,redirect,render_template,request
from flask_login import current_user, login_required
from app.models import db, Server
from app.forms import ServerForm

server_routes = Blueprint('server', __name__)


@server_routes.route("/current")
#@login_required
def get_current_servers():
  """Query for all servers and returns them in a list of user dictionaries
  """
  # if not current_user.is_authenticated:
  #   return "current_user.is_authenticated"
  

 
  print(current_user)
  servers = Server.query.filter(Server._owner_id==current_user.id).all()
  return {'servers': [server.to_dict() for server in servers]}, 200

  

@server_routes.route("/")
def get_all_servers():
  """Query for all servers and returns them in a list of user dictionaries """

  servers = Server.query.all()
  #return f"{servers[0].owner}"
  return {'servers': [server.to_dict() for server in servers]}, 200

@server_routes.route("/new", methods=["POST"])
def add_new_server():
    """returns a new post form on get requests, 
    validates and saves the new resource on post"""


    form = ServerForm()
    form["csrf_token"].data=request.cookies["csrf_token"]
    # print(form.author.choices)
    # query for data if needed in the form

    if form.validate_on_submit(): 

      params={ "icon_url": form.data["icon_url"],
            "public": form.data["public"],
            "name": form.data["name"],
            "max_users": form.data["max_users"],
            "topic": form.data["topic"],
            "description": form.data["description"]}
      
      new_server =Server(**params)
      print(new_server)
      try:
        db.session.add(new_server)
        db.session.commit()
        return new_server.to_dict(), 201
      except Exception as e:
        return {"errors": str(e)}, 500
   
    return {"errors": form.errors }, 400


@server_routes.route('/<int:id>', methods=["PUT"])
def edit_a_server(id):
    """returns a new post form on get requests, 
    validates and saves the new resource on post"""


    form = ServerForm()
    form["csrf_token"].data=request.cookies["csrf_token"]
    # print(form.author.choices)
    # query for data if needed in the form

    if form.validate_on_submit(): 
      server=Server.query.get(id)

      server.icon_url = form.data["icon_url"]
      server.type = form.data["type"]
      server.name = form.data["name"]
      server.max_users = form.data["max_users"]
      server.topic = form.data["topic"]
      server.description = form.data["description"]
      
      
      try:
        db.session.commit()
        return server.to_dict(), 201
      except Exception as e:
        return {"errors": str(e)}, 500
   
    return {"errors": form.errors }, 400


@server_routes.route('/<int:id>')
#@login_required
def get_one_server(id):
  """Query for one server and returns them in a dictionary
  """
  
  server = Server.query.get(id)
  if(server==None):
    return {"errors":"Film not found"}, 404
  return server.to_dict(), 200


@server_routes.route('/<int:id>', methods=["DELETE"])
#@login_required
def delete_one_server(id):
  """Query for all servers and returns them in a list of user dictionaries
  """
  
  server = Server.query.get(id)
  if(server==None):
    return {"errors":"Film not found"}, 404
  else:
    try:
      db.session.delete(server)
      db.session.commit()
      return {"message":f"Successfully deleted{server._name}!"}, 204
    except Exception as e:
      return {"errors": str(e)}, 500




