from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, field_validator


Visibility = Literal["public", "private"]


class HostedZoneCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=500)
    visibility: Visibility = "public"

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip().lower().rstrip(".")

        if not value or "." not in value:
            raise ValueError("Enter a valid domain name")

        return value


class HostedZoneUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=500)
    visibility: Visibility | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip().lower().rstrip(".")

        if not value or "." not in value:
            raise ValueError("Enter a valid domain name")

        return value


class HostedZoneResponse(BaseModel):
    id: int
    name: str
    description: str | None
    visibility: str
    user_id: int
    created_at: datetime
    updated_at: datetime


class HostedZoneListResponse(BaseModel):
    id: int
    name: str
    description: str | None
    visibility: str
    record_count: int
    created_at: datetime