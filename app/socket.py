from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from flask import request


socketio = SocketIO(cors_allowed_origins="*")

# @socketio.on("chat")
# def handle_chat(data):
#     print(data)
#     emit("chat", data, broadcast=True)



# @socketio.on('connect')
# def on_connect(obj):
#     other_user_id = obj["other_user_id"]
#     current_user_id = obj["userId"]
#     room = f"{current_user_id}-{other_user_id}"
#     print('This is the room', room)
#     join_room(room)


# @socketio.on('disconnect')
# def on_disconnect():
#     for room in list(request.namespace.rooms):
#         leave_room(room)

# @socketio.on('direct_message')
# def on_direct_message(data):
#     content = data['content']
#     print('This is the data',data)
#     room = data['room']
#     emit('direct_message', {'content': content}, room=room)

#Here, data is a dictionary containing the message content
#  and the room name.
#  The room parameter is used to specify the
#  room to which the message should be sent.
active_rooms = {}

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('join')
def handle_join(data):
    """Join a chat room"""
    username = data['username']
    friendname = data['friendname']
    room_name = f"{username}_{friendname}"
    join_room(room_name)
    active_rooms[room_name] = 1
    print(f"{username} joined room {room_name}")
    emit('room_joined', {'room_name': room_name})

@socketio.on('leave')
def handle_leave(data):
    """Leave a chat room"""
    username = data['username']
    friendname = data['friendname']
    room_name = f"{username}_{friendname}"
    leave_room(room_name)
    active_rooms.pop(room_name, None)
    print(f"{username} left room {room_name}")
    emit('room_left', {'room_name': room_name})

@socketio.on('message')
def handle_message(data):
    """Handle incoming messages"""
    username = data['username']
    friendname = data['friendname']
    room_name = f"{username}_{friendname}"
    message = data['message']
    print(f"{message} from {username} to {friendname}")
    emit('message', {'message': message}, room=room_name)
