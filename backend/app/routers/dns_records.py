from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.dns_record import (
    DNSRecordCreate,
    DNSRecordResponse,
    DNSRecordUpdate,
)
from app.services import dns_record


router = APIRouter(
    prefix="/api/hosted-zones/{zone_id}/records",
    tags=["DNS Records"],
)


@router.post(
    "",
    response_model=DNSRecordResponse,
    status_code=201,
)
def create(
    zone_id: int,
    data: DNSRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zone = dns_record.get_zone(
        db,
        zone_id,
        current_user,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    return dns_record.create_record(
        db,
        zone_id,
        data,
    )


@router.get("")
def list_all(
    zone_id: int,
    search: str | None = None,
    type: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zone = dns_record.get_zone(
        db,
        zone_id,
        current_user,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    records, total = dns_record.list_records(
        db,
        zone_id,
        search,
        type,
        page,
        limit,
    )

    return {
        "items": records,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (
            (total + limit - 1) // limit
        ),
    }


@router.get(
    "/{record_id}",
    response_model=DNSRecordResponse,
)
def get(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zone = dns_record.get_zone(
        db,
        zone_id,
        current_user,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    record = dns_record.get_record(
        db,
        zone_id,
        record_id,
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found",
        )

    return record


@router.put(
    "/{record_id}",
    response_model=DNSRecordResponse,
)
def update(
    zone_id: int,
    record_id: int,
    data: DNSRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zone = dns_record.get_zone(
        db,
        zone_id,
        current_user,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    record = dns_record.get_record(
        db,
        zone_id,
        record_id,
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found",
        )

    return dns_record.update_record(
        db,
        record,
        data,
    )


@router.delete("/{record_id}")
def delete(
    zone_id: int,
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    zone = dns_record.get_zone(
        db,
        zone_id,
        current_user,
    )

    if not zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted zone not found",
        )

    record = dns_record.get_record(
        db,
        zone_id,
        record_id,
    )

    if not record:
        raise HTTPException(
            status_code=404,
            detail="DNS record not found",
        )

    dns_record.delete_record(
        db,
        record,
    )

    return {
        "message": "DNS record deleted successfully"
    }