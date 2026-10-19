"""TNG payment webhook.

The gateway calls this when a payment succeeds. The real version MUST verify the
signature from the TNG docs before trusting the body, and should ignore duplicate
events (same order_ref sent twice).
"""
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session

from ..db import get_db
from ..models import Ledger
from ..schemas import TngEvent

router = APIRouter(prefix="/webhooks", tags=["integrations"])


@router.post("/tng")
def tng_webhook(event: TngEvent, x_tenant: str = Header("mak"), db: Session = Depends(get_db)):
    # TODO: verify signature header here
    # TODO: skip if (tenant, order_ref, source="tng") already exists
    if event.status == "SUCCESS":
        db.add(
            Ledger(
                tenant_id=x_tenant,
                order_ref=event.order_ref,
                kind="sale",
                amount=event.amount,
                source="tng",
            )
        )
        db.commit()
    return {"received": True}
