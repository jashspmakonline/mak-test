"""mak-admin entry point: creates the app and plugs the pieces together."""
from fastapi import FastAPI

from . import models  # noqa: F401  (registers the tables before create_all)
from .db import Base, engine
from .integrations import lalamove, tng
from .routers import crm, finance, itsm

Base.metadata.create_all(engine)

app = FastAPI(title="mak-admin")

app.include_router(crm.router)
app.include_router(finance.router)
app.include_router(itsm.router)
app.include_router(tng.router)
app.include_router(lalamove.router)


@app.get("/health")  # ALB / ECS health check hits this
def health():
    return {"ok": True}
