from flask import Blueprint, jsonify, session, request
from app.models import db, Channel, ChannelMessage, Server
from .auth_routes import validation_errors_to_error_messages


channels_routes = Blueprint('channels', __name__)


@channels_routes.route('/')
@login
