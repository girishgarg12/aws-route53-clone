from fastapi import Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.auth import get_user_from_session


SESSION_COOKIE_NAME = "route53_session"


def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:

    session_id = request.cookies.get(SESSION_COOKIE_NAME)

    if not session_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    user = get_user_from_session(db, session_id)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Session expired or invalid",
        )

    return user