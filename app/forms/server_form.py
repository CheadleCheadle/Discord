from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, TextAreaField, SubmitField
from wtforms.validators import DataRequired


class ServerForm(FlaskForm):
    icon_url = StringField('Image Url' )
    public  = BooleanField('Public')
    name = StringField('Name', validators=[DataRequired()])
    max_users = IntegerField('Max Users', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    submit = SubmitField('submit')

