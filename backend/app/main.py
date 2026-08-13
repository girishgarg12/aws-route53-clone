from fastapi import FastAPI
from sqlalchemy import select

from app.database import Base, engine, SessionLocal
from app.models import User, Session, HostedZone, DNSRecord
from app.routers import auth
from app.services.auth import hash_password

from app.routers import auth, hosted_zones, dns_records


Base.metadata.create_all(bind=engine)


def seed_demo_user():
    db = SessionLocal()

    try:
        existing_user = db.scalar(
            select(User).where(
                User.email == "demo@route53clone.com"
            )
        )

        if existing_user:
            return

        demo_user = User(
            email="demo@route53clone.com",
            password_hash=hash_password("Route53@123"),
        )

        db.add(demo_user)
        db.commit()

    finally:
        db.close()


seed_demo_user()


app = FastAPI(
    title="Route53 Clone",
)

app.include_router(auth.router)

app.include_router(hosted_zones.router)

app.include_router(dns_records.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}