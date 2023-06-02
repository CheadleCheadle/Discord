from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, IntegerField, DateField, MultipleFileField
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms.validators import DataRequired
from app.api.AWS_HELPERS import ALLOWED_EXTENSIONS
class UserFileForm(FlaskForm):
    file = FileField("File", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
class UserForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired(message="Username required")])
    about = StringField("About", validators=[DataRequired(message="About required")])
