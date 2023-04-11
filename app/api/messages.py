from flask import Blueprint, request
from app.models import Server, Channel, db
from flask_login import current_user
from ..forms import ChannelForm

server_routes = Blueprint('server', __name__)
