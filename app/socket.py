from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from .api import user_routes
from flask import request
from app.models import DirectMessage, db, ChannelMessage, User, server_memberships, Server
from flask_login import current_user, login_required
from datetime import datetime
import json
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
active_users = {}

@user_routes.route('/online')
@login_required
def get_online_users():
    return {'users': list(online_users.values())}


@socketio.on('join_server_room')
def join_server_room(data):
    room_name = data["roomName"]
    user = data["user"]
    join_room(room_name)
    active_rooms[room_name] = 1
    emit("join_message", {"Joined":"I joined the server room"})


@socketio.on('join_server')
def join_server(data):
    server_id = data["serverId"]
    server = Server.query.get(server_id)
    room_name = data["roomName"]
    if request.method == 'POST':
        add_user_id = data["userId"]
        new_member = User.query.get(add_user_id)
        post_membership = db.session.execute(
            server_memberships.update().where(server_memberships.c.user_id == add_user_id).where(server_memberships.c.server_id == server_id).values(status="Member"))
        db.session.commit()

        return {"status": 'Member', "userId": new_member.id, "serverId": server.id},  201

    user_id = data["userId"]
    user = User.query.get(user_id)

    membership = db.session.query(
        server_memberships).filter(server_memberships.c.user_id == user_id, server_memberships.c.server_id == server_id).first()

    if request.method == 'DELETE':
        if not server or not user or not membership:
            return {"errors": "Resources not found."}, 404
        host_bool = server.owner_id == user.id
        if (host_bool):
            return {"errors": "Permission Denied"}, 401
        user_bool = membership.user_id == user.id
        if not (user_bool):
            return {"errors": "Permission Denied"}, 401
        server.users.remove(user)
        db.session.commit()
        return {"Success": "Membership deleted."}, 202

    if membership:
        return {'error': "Membership already exists"}, 409

    server.add_member(user, "Pending")
    db.session.commit()

    new_membership = db.session.query(
        server_memberships).filter(server_memberships.c.user_id == user_id, server_memberships.c.server_id == server_id).first()
    converted_membership = dict(new_membership)
    emit("new_member", {"membership": converted_membership, "user": user.to_safe_dict()}, room=room_name, broadcast=True)

@socketio.on('server_joined')
def handle_joined(data):
    membership = data["membership"]
    room_name = data["roomName"]
    emit('joined', membership, room=room_name, broadcast=True)


@socketio.on('connecting')
def handle_connect(data):
    user = data["user"]
    user_id = user["id"]

    active_users[user_id] = {
        'connection_id': request.sid,
        'active': True
    }
    emit('status_update', {'user': user, 'active': True}, broadcast=True)

@socketio.on('disconnectingUser')
def handle_disconnect(data):

    user = data["user"]
    user_id = user["id"]


    if user_id in active_users:
        del active_users[user_id]
        emit('status_update', {'user': user, 'active': False}, broadcast=True)



@socketio.on('channel_join')
def handle_channel_join(data):
    """Join a channel"""
    channel_name = data['channelName']
    join_room(channel_name)
    active_rooms[channel_name] = 1


@socketio.on('channel_message')
def handle_channel_message(data):
    """Handle channel messages"""
    channel = data['channel']
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



@socketio.on('startStreaming')
def handle_start_streaming(audio_stream):
    emit('audioStream', audio_stream, broadcast=True)



@socketio.on('audioData')
def handle_audio_data(audio_data):
    # Broadcast the received audio data to all other users in the room
    emit('audioStream', audio_data, broadcast=True)

@socketio.on('offer')
def handle_offer(data):
    # Send the offer to all other users in the room
    offer = data["offer"]
    room = data["room"]
    join_room(room)
    emit('offer', offer, room=room, include_self=False)

@socketio.on('answer')
def handle_answer(answer):
    # Send the answer to the user who initiated the offer
    emit('answer', answer)

@socketio.on('disconnect')
def handle_disconnect():
    # Clean up by leaving all rooms when a user disconnects
    for room_id in active_rooms(sid=request.sid):
        leave_room(room_id)




@socketio.on('joinRoom')
def handle_join_room(room):
    join_room(room)
    emit('roomJoined', room, room=room)

@socketio.on('leaveRoom')
def handle_leave_room(room):
    leave_room(room)
    emit('roomLeft', room, room=room)
