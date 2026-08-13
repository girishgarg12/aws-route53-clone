from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.dns_record import DNSRecord
from app.models.hosted_zone import HostedZone
from app.models.user import User
from app.schemas.dns_record import (
    DNSRecordCreate,
    DNSRecordUpdate,
    validate_record_value,
)


def get_zone(
    db: Session,
    zone_id: int,
    user: User,
):
    return db.scalar(
        select(HostedZone).where(
            HostedZone.id == zone_id,
            HostedZone.user_id == user.id,
        )
    )


def create_record(
    db: Session,
    zone_id: int,
    data: DNSRecordCreate,
) -> DNSRecord:

    record = DNSRecord(
        hosted_zone_id=zone_id,
        name=data.name,
        type=data.type,
        ttl=data.ttl,
        value=data.value,
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


def list_records(
    db: Session,
    zone_id: int,
    search: str | None,
    record_type: str | None,
    page: int,
    limit: int,
):
    query = select(DNSRecord).where(
        DNSRecord.hosted_zone_id == zone_id
    )

    if search:
        search = search.strip()

        query = query.where(
            DNSRecord.name.ilike(f"%{search}%")
            | DNSRecord.value.ilike(f"%{search}%")
        )

    if record_type:
        query = query.where(
            DNSRecord.type == record_type
        )

    total = db.scalar(
        select(func.count()).select_from(
            query.subquery()
        )
    ) or 0

    offset = (page - 1) * limit

    records = db.scalars(
        query
        .order_by(DNSRecord.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()

    return records, total


def get_record(
    db: Session,
    zone_id: int,
    record_id: int,
):
    return db.scalar(
        select(DNSRecord).where(
            DNSRecord.id == record_id,
            DNSRecord.hosted_zone_id == zone_id,
        )
    )


def update_record(
    db: Session,
    record: DNSRecord,
    data: DNSRecordUpdate,
) -> DNSRecord:

    updates = data.model_dump(
        exclude_unset=True
    )

    new_type = updates.get(
        "type",
        record.type,
    )

    new_value = updates.get(
        "value",
        record.value,
    )

    validate_record_value(
        new_type,
        new_value,
    )

    for field, value in updates.items():
        setattr(record, field, value)

    db.commit()
    db.refresh(record)

    return record


def delete_record(
    db: Session,
    record: DNSRecord,
):
    db.delete(record)
    db.commit()