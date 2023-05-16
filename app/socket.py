from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from .api import user_routes
from flask import request
from app.models import DirectMessage, db, ChannelMessage
from flask_login import current_user, login_required
from datetime import datetime
# configure cors_allowed_origins
if os.environ.get('FLASK_ENV') == 'production':
    origins = [
        'http://discord-wa36.onrender.com',
        'https://discord-wa36.onrender.com'
    ]
else:
    origins = "*"

socketio = SocketIO(cors_allowed_origins=origins)

active_rooms = {}
online_users = {}

@user_routes.route('/online')
@login_required
def get_online_users():
    print('Client connected111111111111111111111111111111111111111111111111111111111111111111111111111111')
    return {'users': list(online_users.values())}



@socketio.on('connect')
def handle_connect():
    print('Client connected22222222222222222')
    # online_users[request.sid] = {"user": current_user.to_dict()}
    # emit('online_users', {'users': list(online_users.values())}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    del online_users[request.sid]
    emit('online_users', {'users': list(online_users.values())}, broadcast=True)

@socketio.on('channel_join')
def handle_channel_join(data):
    """Join a channel"""
    print("I joined a channel room!, 1111111111111111111111111111111111111")
    channel_name = data['channelName']
    join_room(channel_name)
    active_rooms[channel_name] = 1


@socketio.on('channel_message')
def handle_channel_message(data):
    """Handle channel messages"""
    print('22222222222222222222222222222222222222222')
    channel = data['channel']
    print("THIS IS THE CHANNEL", channel)
    channel_name = channel['name']
    message = data['message']
    user_id = data['userId']
    new_message = ChannelMessage(
        user_id=user_id,
        channel_id = channel['id'],
        _content= message
    )
    db.session.add(new_message)
    db.session.commit()
    the_message = new_message.to_dict()
    the_message["time_stamp"] = str(the_message["time_stamp"])
    emit('new_channel_message', the_message, broadcast=True, room=channel_name)


@socketio.on('join')
def handle_join(data):
    """Join a chat room"""
    username = data['username']
    friendname = data['friendname']
    char_code = data["charCode2"]
    join_room(char_code)
    active_rooms[char_code] = 1
    emit('room_joined', {'room_name': char_code})


@socketio.on('leave')
def handle_leave(data):
    """Leave a chat room"""
    char_code = data["charCode2"]

    leave_room(char_code)
    active_rooms.pop(char_code, None)
    emit('room_left', {'room_name': char_code})


@socketio.on('message')
def handle_message(data):
    """Handle incoming messages"""
    username = data['username']
    friendname = data['friendname']
    user_id = data["userId"]
    recipient_id = data["friendId"]
    char_code = data['charCode2']
    message = data['message']
    new_message = DirectMessage(
        user_id = data["userId"],
        recipient_id=data["friendId"],
        _content = message,
    )
    db.session.add(new_message)
    db.session.commit()
    the_message = new_message.to_dict()
    the_message["time_stamp"] = str(the_message["time_stamp"])
    emit('new_message', the_message,
         broadcast=True, room=char_code)
