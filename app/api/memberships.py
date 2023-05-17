from flask import Blueprint
from app.models import db, Channel, ChannelMessage, server_memberships, User, Server
from flask_login import current_user, login_required
import json

membership_routes = Blueprint('memberships', __name__)


@membership_routes.route('/curr')
@login_required
def get_server_memberships():
    # memberships = db.session.query(server_memberships).join(Server).join(User).filter(
    #     server_memberships.c.user_id == current_user.id).all()
    memberships = db.session.query(server_memberships).all()
    membership_status = {f"{membership.id}": {
        "status": membership.status,
        "user_id": membership.user_id,
        "server_id": membership.server_id,
        "id": membership.id,
    } for membership in memberships}
    return membership_status


@membership_routes.route('/servers/<int:server_id>')
@login_required
def get_all_memberships(server_id):

    memberships = db.session.query(server_memberships).join(Server).join(User).where(server_memberships.c.server_id == server_id).all()
    membership_status = {f"{membership.user_id}": {
        "status": membership.status,
        "user_id": membership.user_id,
        "server_id": membership.server_id
    } for membership in memberships}
    return membership_status


@membership_routes.route('/host/<int:server_id>')
@login_required
def get_host(server_id):
    host = db.session.query(User).join(server_memberships).where(
        server_memberships.c.server_id == server_id,
        server_memberships.c.status == "Host"
    ).first()
    return host.to_safe_dict()

@membership_routes.route('/members/<int:server_id>')
@login_required
def get_the_members(server_id):
    members = db.session.query(User).join(server_memberships).where(
        server_memberships.c.server_id == server_id,
        server_memberships.c.status== "Member"
    ).all()
    return [member.to_safe_dict() for member in members]


@membership_routes.route('/pending/<int:server_id>')
@login_required
def get_members(server_id):
    members = db.session.query(User).join(server_memberships).where(
        server_memberships.c.server_id == server_id,
        server_memberships.c.status== "Pending"
    ).all()
    return [member.to_safe_dict() for member in members]
