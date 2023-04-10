from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, TextField, SubmitField
from wtforms.validators import DataRequired


class ServerForm(FlaskForm):
    icon_url = StringField('Image Url', validators=[DataRequired()])
    type  = BooleanField('Public', validators=[DataRequired()])
    name = StringField('Name', validators=[DataRequired()])
    max_users = IntegerField('Max Users', validators=[DataRequired()])
    topic = StringField('Topic', validators=[DataRequired()])
    description = TextField('Description', validators=[DataRequired()])
    submit = SubmitField('submit')

