from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, TextAreaField, SubmitField
from wtforms.validators import DataRequired


class ServerForm(FlaskForm):
<<<<<<< HEAD
    icon_url = StringField('Image Url' )
    public  = BooleanField('Public', validators=[DataRequired()])
=======
    icon_url = StringField('Image Url', validators=[DataRequired()])
    public_ = StringField('Public', validators=[DataRequired()])
>>>>>>> 7ab2a3817cd9e1ef2df51b49210238246aac4895
    name = StringField('Name', validators=[DataRequired()])
    max_users = IntegerField('Max Users', validators=[DataRequired()])
    description = TextAreaField('Description', validators=[DataRequired()])
    submit = SubmitField('submit')
