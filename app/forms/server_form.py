from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, TextAreaField, SubmitField
from wtforms.validators import DataRequired,URL,NumberRange


class ServerForm(FlaskForm):
    icon_url = StringField('Image Url', validators=[DataRequired(message="Image url is required."),URL(message='Must be a valid URL')])
    public_ = StringField('Public', validators=[DataRequired(message="Please check Public or Private.")])
    name = StringField('Name', validators=[DataRequired(message="name is required.")])
    max_users = IntegerField('Max Users', validators=[DataRequired(message="Please provide Max number of Users."),NumberRange(min=3, message="Max number of Users must be 3 or greater.")])
    description = TextAreaField('Description', validators=[DataRequired(message="Please provide description.")])
    submit = SubmitField('submit')
