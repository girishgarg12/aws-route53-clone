from fastapi import FastAPI

from app.database import Base, engine
from app.models import User, HostedZone, DNSRecord


Base.metadata.create_all(bind=engine)


app = FastAPI(title="Route53 Clone")


@app.get("/health")
def health_check():
    return {"status": "ok"}