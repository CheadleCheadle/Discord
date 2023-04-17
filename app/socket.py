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
    char_code = data["charCode2"]
    join_room(char_code)
    active_rooms[char_code] = 1
    emit('room_joined', {'room_name': char_code})


@socketio.on('leave')
def handle_leave(data):
    """Leave a chat room"""
    username = data['username']
    friendname = data['friendname']
    char_code = data["charCode2"]

    leave_room(char_code)
    active_rooms.pop(char_code, None)
    emit('room_left', {'room_name': char_code})


@socketio.on('message')
def handle_message(data):
    """Handle incoming messages"""
    username = data['username']
    friendname = data['friendname']
    char_code = data['charCode2']
    message = data['message']
    print("step-2-22222222222222222222222222222222222222222222222222222222222222222222222222222", char_code)
    emit('new_message', {'message': message},
         broadcast=True, room=char_code)
