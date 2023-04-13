from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from wtforms.validators import DataRequired,NumberRange


class ChannelForm(FlaskForm):
    name = StringField(
        'Name', validators=[DataRequired(message="name is required.")])
    type = StringField(
        'Type', validators=[DataRequired(message="type is required.")])
    max_users = IntegerField(
        'Max Users', validators=[DataRequired(message="max_users is required."),NumberRange(min=3, message="Max number of Users must be 3 or greater.")])
    topic = StringField(
        'Topic', validators=[DataRequired(message="Topic is required.")])
    submit = SubmitField('submit')
