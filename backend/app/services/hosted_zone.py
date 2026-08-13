from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.dns_record import DNSRecord
from app.models.hosted_zone import HostedZone
from app.models.user import User
from app.schemas.hosted_zone import (
    HostedZoneCreate,
    HostedZoneUpdate,
)


def create_hosted_zone(
    db: Session,
    data: HostedZoneCreate,
    user: User,
) -> HostedZone:

    zone = HostedZone(
        name=data.name,
        description=data.description,
        visibility=data.visibility,
        user_id=user.id,
    )

    db.add(zone)
    db.commit()
    db.refresh(zone)

    return zone


def list_hosted_zones(
    db: Session,
    user: User,
    search: str | None,
    page: int,
    limit: int,
):
    query = select(HostedZone).where(
        HostedZone.user_id == user.id
    )

    if search:
        query = query.where(
            HostedZone.name.ilike(f"%{search.strip()}%")
        )

    total = db.scalar(
        select(func.count()).select_from(
            query.subquery()
        )
    ) or 0

    offset = (page - 1) * limit

    zones = db.scalars(
        query
        .order_by(HostedZone.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()

    result = []

    for zone in zones:
        record_count = db.scalar(
            select(func.count())
            .select_from(DNSRecord)
            .where(
                DNSRecord.hosted_zone_id == zone.id
            )
        ) or 0

        result.append(
            {
                "id": zone.id,
                "name": zone.name,
                "description": zone.description,
                "visibility": zone.visibility,
                "record_count": record_count,
                "created_at": zone.created_at,
            }
        )

    return result, total


def get_hosted_zone(
    db: Session,
    zone_id: int,
    user: User,
) -> HostedZone | None:

    return db.scalar(
        select(HostedZone).where(
            HostedZone.id == zone_id,
            HostedZone.user_id == user.id,
        )
    )


def update_hosted_zone(
    db: Session,
    zone: HostedZone,
    data: HostedZoneUpdate,
) -> HostedZone:

    updates = data.model_dump(
        exclude_unset=True
    )

    for field, value in updates.items():
        setattr(zone, field, value)

    db.commit()
    db.refresh(zone)

    return zone


def delete_hosted_zone(
    db: Session,
    zone: HostedZone,
):
    db.delete(zone)
    db.commit()