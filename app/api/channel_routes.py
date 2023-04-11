from flask import Blueprint, jsonify, session, request
from app.models import db, Channel, ChannelMessage, Server
from .auth_routes import validation_errors_to_error_messages
from flask_login import login_required

channel_routes = Blueprint('channel', __name__)


# def membership_required():
#     def inner_func():


@channel_routes.route('/<int:channel_id>')
@login_required
def get_channel_by_channel_id(channel_id):
    channel = Channel.query.get(channel_id)
    return {"channel": channel.to_dict()}


@channel_routes.route('/<int:channel_id>/messages')
@login_required
def get_channel_messages_by_channel_id(channel_id):
    all_messages = ChannelMessage.query.filter(
        ChannelMessage.channel_id == channel_id).order_by(ChannelMessage._time_stamp)
    return {"channel_messages": [message.to_safe_dict() for message in all_messages]}


@channel_routes.route('/<int:channel_id>/users/<int:user_id>/messages')
@login_required
def get_channel_messages_by_user_id(channel_id, user_id):
    all_messages = ChannelMessage.query.filter(
        ChannelMessage.channel_id == channel_id, ChannelMessage.user_id == user_id
    ).order_by(ChannelMessage._time_stamp)
    return {"channel_messages": [message.to_safe_dict() for message in all_messages]}


# @server_routes.route('/new', methods=['POST'])
# @login_required
# def create_new_channel():
