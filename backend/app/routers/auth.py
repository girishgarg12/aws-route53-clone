from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import LoginRequest, UserResponse
from app.services.auth import (
    authenticate_user,
    create_session,
    delete_session,
    get_user_from_session,
)


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


SESSION_COOKIE_NAME = "route53_session"


@router.post("/login", response_model=UserResponse)
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    user = authenticate_user(
        db,
        data.email,
        data.password,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    session = create_session(
        db,
        user.id,
    )

    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session.id,
        httponly=True,
        samesite="lax",
        secure=False,
        max_age=60 * 60 * 24,
    )

    return user


@router.post("/logout")
def logout(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session_id = request.cookies.get(
        SESSION_COOKIE_NAME
    )

    if session_id:
        delete_session(db, session_id)

    response.delete_cookie(
        key=SESSION_COOKIE_NAME
    )

    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
):
    session_id = request.cookies.get(
        SESSION_COOKIE_NAME
    )

    if not session_id:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    user = get_user_from_session(
        db,
        session_id,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Session expired or invalid",
        )

    return user