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
        'username', validators=[DataRequired(), username_exists])
    firstname = StringField(
        'firstname', validators=[DataRequired()])
    lastname = StringField(
        'lastname', validators=[DataRequired()])
    photo_url = StringField(
        'photo_url', validators=[DataRequired()])
    email = StringField('email', validators=[DataRequired(), user_exists])
    topic = StringField('topic', validators=[DataRequired()])
    active_status = BooleanField('topic')
    password = StringField('password', validators=[DataRequired()])