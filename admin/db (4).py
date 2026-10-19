"""Database engine, base class and the per-request session."""
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session

from .config import DATABASE_URL

engine = create_engine(DATABASE_URL, pool_pre_ping=True)


class Base(DeclarativeBase):
    pass


def get_db():
    with Session(engine) as session:
        yield session
