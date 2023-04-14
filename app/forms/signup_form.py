from flask_wtf import FlaskForm
from wtforms import StringField,BooleanField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    username = StringField(
        'username', validators=[DataRequired(message="username is required."), username_exists])
    firstname = StringField(
        'firstname', validators=[DataRequired(message="firstname is required.")])
    lastname = StringField(
        'lastname', validators=[DataRequired(message="lastname is required.")])
    photo_url = StringField(
        'photo_url', validators=[DataRequired(message="photo url is required.")])
    email = StringField('email', validators=[DataRequired(message="email is required."),Email(message="not valid email format.")
, user_exists])
    topic = StringField('topic', validators=[DataRequired(message="topic is required.")])
    active_status = BooleanField('topic')
    password = StringField('password', validators=[DataRequired(message="password is required.")])
