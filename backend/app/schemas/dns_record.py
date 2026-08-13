from datetime import datetime
from typing import Literal

from ipaddress import ip_address
import re

from pydantic import BaseModel, Field, field_validator, model_validator


RecordType = Literal[
    "A",
    "AAAA",
    "CNAME",
    "TXT",
    "MX",
    "NS",
    "PTR",
    "SRV",
    "CAA",
]


def validate_hostname(value: str) -> str:
    value = value.strip().rstrip(".")

    if not value:
        raise ValueError("Hostname cannot be empty")

    if len(value) > 253:
        raise ValueError("Hostname is too long")

    hostname_pattern = re.compile(
        r"^(?=.{1,253}$)"
        r"(?:[A-Za-z0-9]"
        r"(?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?"
        r"\.)*"
        r"[A-Za-z0-9]"
        r"(?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$"
    )

    if not hostname_pattern.match(value):
        raise ValueError("Invalid hostname")

    return value.lower()


class DNSRecordCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    type: RecordType
    ttl: int = Field(default=300, gt=0, le=86400)
    value: str = Field(min_length=1)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        return validate_hostname(value)

    @field_validator("value")
    @classmethod
    def clean_value(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Value cannot be empty")

        return value

    @model_validator(mode="after")
    def validate_record_value(self):
        validate_record_value(self.type, self.value)
        return self


class DNSRecordUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    type: RecordType | None = None
    ttl: int | None = Field(
        default=None,
        gt=0,
        le=86400,
    )
    value: str | None = Field(
        default=None,
        min_length=1,
    )

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is None:
            return None

        return validate_hostname(value)

    @field_validator("value")
    @classmethod
    def clean_value(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("Value cannot be empty")

        return value


class DNSRecordResponse(BaseModel):
    id: int
    hosted_zone_id: int
    name: str
    type: str
    ttl: int
    value: str
    created_at: datetime
    updated_at: datetime


def validate_record_value(
    record_type: str,
    value: str,
):
    if record_type == "A":
        try:
            ip = ip_address(value)

            if ip.version != 4:
                raise ValueError

        except ValueError:
            raise ValueError(
                "A record must contain a valid IPv4 address"
            )

    elif record_type == "AAAA":
        try:
            ip = ip_address(value)

            if ip.version != 6:
                raise ValueError

        except ValueError:
            raise ValueError(
                "AAAA record must contain a valid IPv6 address"
            )

    elif record_type in {"CNAME", "NS", "PTR"}:
        validate_hostname(value)

    elif record_type == "MX":
        parts = value.split()

        if len(parts) != 2:
            raise ValueError(
                "MX value must be: priority hostname"
            )

        try:
            priority = int(parts[0])

            if priority < 0 or priority > 65535:
                raise ValueError

        except ValueError:
            raise ValueError(
                "MX priority must be between 0 and 65535"
            )

        validate_hostname(parts[1])

    elif record_type == "SRV":
        parts = value.split()

        if len(parts) != 4:
            raise ValueError(
                "SRV value must be: priority weight port hostname"
            )

        try:
            priority = int(parts[0])
            weight = int(parts[1])
            port = int(parts[2])

            if not 0 <= priority <= 65535:
                raise ValueError

            if not 0 <= weight <= 65535:
                raise ValueError

            if not 0 <= port <= 65535:
                raise ValueError

        except ValueError:
            raise ValueError(
                "SRV priority, weight and port must be "
                "between 0 and 65535"
            )

        validate_hostname(parts[3])

    elif record_type == "CAA":
        parts = value.split(maxsplit=2)

        if len(parts) != 3:
            raise ValueError(
                'CAA value must be: flags tag "value"'
            )

        try:
            flags = int(parts[0])

            if not 0 <= flags <= 255:
                raise ValueError

        except ValueError:
            raise ValueError(
                "CAA flags must be between 0 and 255"
            )

        if not parts[1]:
            raise ValueError("CAA tag cannot be empty")

    elif record_type == "TXT":
        if len(value) > 4096:
            raise ValueError(
                "TXT value is too long"
            )