from .db import db, environment, SCHEMA, add_prefix_for_prod


channel_subscribers = db.Table(
    "channel_subscribers",
    db.Column(
    "user_id",
    db.Integer, 
    db.ForeignKey(add_prefix_for_prod("users.id")), 
    primary_key = True),
    db.Column(
    "channel_id",
    db.Integer, 
    db.ForeignKey(add_prefix_for_prod("channel_id")), 
    primary_key = True)
),
    
    
    

    

    
