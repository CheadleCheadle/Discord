from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, IntegerField
from wtforms.validators import DataRequired


class ChannelForm(FlaskForm):
    name = StringField(
        'Name', validators=[DataRequired()])
    type = StringField(
        'Type', validators=[DataRequired()])
    max_users = IntegerField(
        'Max Users', validators=[DataRequired()])
    topic = StringField(
        'Topic', validators=[DataRequired()])
    submit = SubmitField('submit')
