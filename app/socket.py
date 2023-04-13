from flask_socketio import SocketIO, emit, join_room, leave_room
import os
from flask import request


socketio = SocketIO(cors_allowed_origins="*")

@socketio.on("chat")
def handle_chat(data):
    print(data)
    emit("chat", data, broadcast=True)
# @socketio.on("join")
# def on_join(data):
#     emit("join", "user has joine")
# @socketio.on("leave")
# def on_join(data):
#     emit("leave", "user has left")
@socketio.on('custom-connect')
def on_connect():
    other_user_id = request.args.get('other_user_id')
    current_user_id = request.args.get('userId')
    room = f"{current_user_id}-{other_user_id}"
    join_room(room)


@socketio.on('disconnect')
def on_disconnect():
    for room in list(request.namespace.rooms):
        leave_room(room)

@socketio.on('direct_message')
def on_direct_message(data):
    content = data['content']
    print('This is the data',data)
    room = data['room']
    emit('direct_message', {'content': content}, room=room)

#Here, data is a dictionary containing the message content
#  and the room name.
#  The room parameter is used to specify the
#  room to which the message should be sent.
