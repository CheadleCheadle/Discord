from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import User, db, DirectMessage
from app.forms import UserForm, UserFileForm
import json
from .AWS_HELPERS import upload_file_to_s3, get_unique_filename
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


@user_routes.route('/curr/messages/recipient/<int:recipient_id>')
@login_required
def get_messages_from_user(recipient_id):
    user_id = current_user.id
    all_messages1 = DirectMessage.query.filter(
        DirectMessage.user_id == user_id,
        DirectMessage.recipient_id == recipient_id
    )
    all_messages_2 = DirectMessage.query.filter(
        DirectMessage.recipient_id == user_id,
        DirectMessage.user_id == recipient_id
    )
    all_messages = [x for n in (all_messages1, all_messages_2) for x in n]
    filtered = [*set(all_messages)]
    filtered.sort(key=lambda msg: msg._time_stamp)
    return [message.to_dict() for message in filtered]

# GET MESSAGES SENT FROM USER TO RECIPIENT


@user_routes.route('/messages/new/<int:recipient_id>', methods=['POST'])
@login_required
def create_direct_message(recipient_id):
    data = json.loads(request.data)
    new_message = DirectMessage(
        user_id=data['userId'],
        recipient_id=recipient_id,
        _content=data['content']
    )
    db.session.add(new_message)
    db.session.commit()
    return new_message.to_dict()
# CREATE A NEW DIRECT MESSAGE

@user_routes.route('/<int:user_id>/edit/image', methods=['PUT'])
@login_required
def edit_user_image(user_id):
    print("000000000000000")
    form = UserFileForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    user_to_edit = User.query.get(user_id)
    if form.validate_on_submit():
        file = form.data["file"]
        if file != 'undefined':
            file.filename = get_unique_filename(file.filename)
            upload = upload_file_to_s3(file)
            if "url" not in upload:
                return {"errors": upload}
        user_to_edit.photo_url = upload["url"]
        db.session.commit()
        return None
    elif form.errors:
        return {"errors": form.errors}


@user_routes.route('/<int:user_id>/edit', methods=['PUT'])
@login_required
def edit_user(user_id):
    form = UserForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        user_to_edit = User.query.get(user_id)
        user_to_edit.username = form.data["username"]
        user_to_edit.about = form.data["about"]
        db.session.commit()
        return user_to_edit.to_dict()
    elif form.errors:
        return {"errors": form.errors}
