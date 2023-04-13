from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db, DirectMessage
import json

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
# @login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>')
# @login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route('/curr/messages/recipient/<int:recipient_id>', methods=["POST"])
@login_required
def get_messages_from_user(recipient_id):
    # user_id = current_user.id
    data = json.loads(request.data)
    user_id = data["userId"]
    print("user", user_id, "recep", recipient_id)
    all_messages = DirectMessage.query.filter(
        DirectMessage.user_id == user_id,
        DirectMessage.recipient_id == recipient_id
    )
    print('HERES ALL THE MESSAGES',[message.to_safe_dict() for message in all_messages])

    return [message.to_safe_dict() for message in all_messages]
# GET MESSAGES SENT FROM USER TO RECIPIENT


@user_routes.route('/messages/new/<int:recipient_id>', methods=['POST'])
@login_required
def create_direct_message(recipient_id):
    data = json.loads(request.data)
    # return data
    new_message = DirectMessage(
        user_id = data['userId'],
        recipient_id=recipient_id,
        _content=data['content']
    )
    db.session.add(new_message)
    db.session.commit()
    return new_message.to_safe_dict()
# CREATE A NEW DIRECT MESSAGE
