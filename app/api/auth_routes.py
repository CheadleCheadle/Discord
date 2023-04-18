from flask import Blueprint, jsonify, session, request
from app.models import User, db, Server, server_memberships
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy import or_, and_
from .memberships import get_all_memberships

auth_routes = Blueprint('auth', __name__)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        all_servers = db.session.query(Server).join(
            server_memberships).filter(server_memberships.c.status != "Pending", server_memberships.c.user_id == current_user.id).all()

        servers_list = [server.to_dict() for server in all_servers]

        for server in servers_list:
            server["memberships"] = get_all_memberships(server["id"])
            print(server["memberships"], "===============================================")

        curr_user_dict = current_user.to_dict()
        curr_user_dict["servers"] = servers_list



        return curr_user_dict
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data['email']).first()
        login_user(user)
        all_servers = db.session.query(Server).join(
            server_memberships).filter(server_memberships.c.status != "Pending", server_memberships.c.user_id == user.id)
        dicted = [server.to_dict() for server in all_servers]

        for server in dicted:
            server["memberships"] = get_all_memberships(server["id"])

        user_dict = user.to_dict()


        user_dict["servers"] = dicted

        return user_dict
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password'],
            firstname=form.data['firstname'],
            lastname=form.data["lastname"],
            photo_url="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
        )
        all_servers = db.session.query(Server).join(
            server_memberships).filter(server_memberships.c.status != "Pending", server_memberships.c.user_id == user.id)
        dicted = [server.to_dict() for server in all_servers]
        for server in dicted:
            server["memberships"] = get_all_memberships(server["id"])

        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
