from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from flask import request


socketio = SocketIO(cors_allowed_origins="*")


active_rooms = {}

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('join')
def handle_join(data):
    """Join a chat room"""
    username = data['username']
    friendname = data['friendname']
    # room_name = f"{username}_{friendname}"
    room_name = str(len(username + friendname))
    join_room(room_name)
    active_rooms[room_name] = 1
    print(f"{username} joined room {room_name}")
    emit('room_joined', {'room_name': room_name})

@socketio.on('leave')
def handle_leave(data):
    """Leave a chat room"""
    username = data['username']
    friendname = data['friendname']
    # room_name = f"{username}_{friendname}"
    room_name = str(len(username + friendname))
    leave_room(room_name)
    active_rooms.pop(room_name, None)
    print(f"{username} left room {room_name}")
    emit('room_left', {'room_name': room_name})

@socketio.on('message')
def handle_message(data):
    """Handle incoming messages"""
    username = data['username']
    friendname = data['friendname']
    # room_name = f"{username}_{friendname}"
    room_name = str(len(username + friendname))
    message = data['message']
    print(f"{message} from {username} to {friendname}")
    emit('message', {'message': message}, room=room_name)
