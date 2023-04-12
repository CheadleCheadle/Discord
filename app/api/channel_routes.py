from flask import Blueprint, jsonify, session, request
from app.models import db, Channel, ChannelMessage, Server
from .auth_routes import validation_errors_to_error_messages
from flask_login import login_required, current_user
from app.forms import ChannelForm
import json


channel_routes = Blueprint('channel', __name__)


# def membership_required():
#     def inner_func():

@channel_routes.route('/<int:channel_id>', methods=['GET', 'DELETE'])
@login_required
def get_channel_by_channel_id(channel_id):
    channel = Channel.query.get(channel_id)
    if request.method == 'DELETE':
        channel_to_delete = Channel.query.get(channel_id)
        db.session.delete(channel_to_delete)
        db.session.commit()
        return {"success": "success"}
    return {"channel": channel.to_dict()}, 200
# GET AND DELETE A CHANNEL


@channel_routes.route('/<int:channel_id>/edit', methods=['PUT'])
@login_required
def edit_channel_by_channel_id(channel_id):
    channel_to_edit = Channel.query.get(channel_id)

    form = ChannelForm()

    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        channel_to_edit._name = form.data["name"]
        channel_to_edit._type = form.data["type"]
        channel_to_edit._max_users = form.data["max_users"]
        channel_to_edit._topic = form.data["topic"]
        db.session.commit()
        return channel_to_edit.to_dict()
    elif form.errors:
        return {"error": form.errors}
# EDIT A CHANNEL


@channel_routes.route('/<int:channel_id>/messages/new', methods=['POST'])
@login_required
def create_a_channel_message(channel_id):
    data = json.loads(request.data)
    print("this is the dat!!", data)
    user_id = current_user.id
    new_message = ChannelMessage(
        user_id=user_id,
        channel_id=data["channelId"],
        _content=data["content"]
    )
    db.session.add(new_message)
    db.session.commit()
    return new_message.to_safe_dict()
# CREATE A NEW CHANNEL MESSAGE


@channel_routes.route('/<int:channel_id>/messages')
@login_required
def get_channel_messages_by_channel_id(channel_id):
    all_messages = ChannelMessage.query.filter(
        ChannelMessage.channel_id == channel_id).order_by(ChannelMessage._time_stamp)
    return {"channel_messages": [message.to_safe_dict() for message in all_messages]}
# GET CHANNEL MESSAGES BY CHANNEL ID


@channel_routes.route('/<int:channel_id>/users/<int:user_id>/messages')
@login_required
def get_channel_messages_by_user_id(channel_id, user_id):
    all_messages = ChannelMessage.query.filter(
        ChannelMessage.channel_id == channel_id, ChannelMessage.user_id == user_id
    ).order_by(ChannelMessage._time_stamp)
    return {"channel_messages": [message.to_safe_dict() for message in all_messages]}
# GET CHANNEL MESSAGES BY USER ID
