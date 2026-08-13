from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.hosted_zone import (
    HostedZoneCreate,
    HostedZoneListResponse,
    HostedZoneResponse,
    HostedZoneUpdate,
)
from app.services import hosted_zone


router = APIRouter(
    prefix="/api/hosted-zones",
    tags=["Hosted Zones"],
)


@router.post(
    "",
    response_model=HostedZoneResponse,
    status_code=201,
)
def create(
    data: HostedZoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return hosted_zone.create_hosted_zone(
        db,
        data,
        current_user,
    )


@router.get("")
def list_all(
    search: str | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zones, total = hosted_zone.list_hosted_zones(
        db,
        current_user,
        search,
        page,
        limit,
    )

    return {
        "items": zones,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (
            (total + limit - 1) // limit
        ),
    }


@router.get(
    "/{zone_id}",
    response_model=HostedZoneResponse,
)
def get(
    zone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zone = hosted_zone.get_hosted_zone(
        db,
        zone_id,
        current_user,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    return zone


@router.put(
    "/{zone_id}",
    response_model=HostedZoneResponse,
)
def update(
    zone_id: int,
    data: HostedZoneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zone = hosted_zone.get_hosted_zone(
        db,
        zone_id,
        current_user,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    return hosted_zone.update_hosted_zone(
        db,
        zone,
        data,
    )


@router.delete("/{zone_id}")
def delete(
    zone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zone = hosted_zone.get_hosted_zone(
        db,
        zone_id,
        current_user,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    hosted_zone.delete_hosted_zone(
        db,
        zone,
    )

    return {
        "message": "Hosted zone deleted successfully"
    }