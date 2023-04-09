"""empty message

Revision ID: 5acb28c12a6e
Revises: 
Create Date: 2023-04-08 23:45:02.245267

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5acb28c12a6e'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=40), nullable=False),
    sa.Column('firstname', sa.String(length=40), nullable=False),
    sa.Column('lastname', sa.String(length=40), nullable=False),
    sa.Column('photo_url', sa.String(length=255), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('active_status', sa.Boolean(), nullable=True),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('direct_messages',
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('_time_stamp', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('recipient_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['recipient_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('friends',
    sa.Column('user1_id', sa.Integer(), nullable=False),
    sa.Column('user2_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user1_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['user2_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('user1_id', 'user2_id')
    )
    op.create_table('servers',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('_icon_url', sa.String(), nullable=True),
    sa.Column('_public', sa.Boolean(), nullable=False),
    sa.Column('_name', sa.String(length=100), nullable=False),
    sa.Column('_max_users', sa.Integer(), nullable=False),
    sa.Column('_description', sa.Text(), nullable=False),
    sa.Column('_owner_id', sa.Integer(), nullable=False),
    sa.Column('_created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['_owner_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('_name')
    )
    op.create_table('channels',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('_server_id', sa.Integer(), nullable=False),
    sa.Column('_name', sa.String(length=40), nullable=False),
    sa.Column('_type', sa.String(length=40), nullable=False),
    sa.Column('_max_users', sa.Integer(), nullable=True),
    sa.Column('_topic', sa.String(length=100), nullable=False),
    sa.ForeignKeyConstraint(['_server_id'], ['servers.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('channel_messages',
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('_time_stamp', sa.DateTime(), nullable=False),
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('channel_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['channel_id'], ['channels.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('channel_messages')
    op.drop_table('channels')
    op.drop_table('servers')
    op.drop_table('friends')
    op.drop_table('direct_messages')
    op.drop_table('users')
    # ### end Alembic commands ###
