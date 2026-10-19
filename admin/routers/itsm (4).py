"""Finance: ledger entries and a summary."""
from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import current_tenant
from ..models import Ledger
from ..schemas import LedgerIn

router = APIRouter(prefix="/finance", tags=["finance"])


@router.post("/ledger")
def add_entry(body: LedgerIn, tenant: str = Depends(current_tenant), db: Session = Depends(get_db)):
    entry = Ledger(tenant_id=tenant, source="manual", **body.model_dump())
    db.add(entry)
    db.commit()
    return {"id": entry.id}


@router.get("/summary")
def summary(tenant: str = Depends(current_tenant), db: Session = Depends(get_db)):
    query = (
        select(Ledger.kind, func.sum(Ledger.amount))
        .where(Ledger.tenant_id == tenant)
        .group_by(Ledger.kind)
    )
    totals = {kind: float(total) for kind, total in db.execute(query)}
    net = totals.get("sale", 0) - totals.get("refund", 0)
    return {"totals": totals, "net_sales": net}
