"""добавлено поле is_active и email_verification_code

Revision ID: c1dd844acc03
Revises: e606089a36ff
Create Date: 2024-10-23 12:18:44.051229

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c1dd844acc03'
down_revision = 'e606089a36ff'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_active', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('email_verification_code', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('email_verification_code')
        batch_op.drop_column('is_active')

    # ### end Alembic commands ###
