from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class ChannelForm(FlaskForm):
    name = StringField(
        'name', validators=[DataRequired()])
    type = StringField(
        'type', validators=[DataRequired()])
    max_users = StringField(
        'max_users', validators=[DataRequired()])
    topic = StringField(
        'topic', validators=[DataRequired()])
    submit = SubmitField('submit')

   
