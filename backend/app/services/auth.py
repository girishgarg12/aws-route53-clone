from datetime import datetime, timedelta
import secrets

from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session as DBSession

from app.models.session import Session
from app.models.user import User


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)

SESSION_DURATION_HOURS = 24


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def authenticate_user(
    db: DBSession,
    email: str,
    password: str,
):
    user = db.scalar(
        select(User).where(User.email == email)
    )

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return user


def create_session(
    db: DBSession,
    user_id: int,
) -> Session:

    session_id = secrets.token_urlsafe(32)

    session = Session(
        id=session_id,
        user_id=user_id,
        expires_at=datetime.utcnow()
        + timedelta(hours=SESSION_DURATION_HOURS),
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


def get_user_from_session(
    db: DBSession,
    session_id: str,
):
    session = db.scalar(
        select(Session).where(Session.id == session_id)
    )

    if not session:
        return None

    if session.expires_at < datetime.utcnow():
        db.delete(session)
        db.commit()
        return None

    return db.get(User, session.user_id)


def delete_session(
    db: DBSession,
    session_id: str,
):
    session = db.get(Session, session_id)

    if session:
        db.delete(session)
        db.commit()