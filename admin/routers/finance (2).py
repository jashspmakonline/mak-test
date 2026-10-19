"""CRM: customers."""
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..deps import current_tenant
from ..models import Customer
from ..schemas import CustomerIn

router = APIRouter(prefix="/crm", tags=["crm"])


@router.post("/customers")
def add_customer(body: CustomerIn, tenant: str = Depends(current_tenant), db: Session = Depends(get_db)):
    customer = Customer(tenant_id=tenant, **body.model_dump())
    db.add(customer)
    db.commit()
    return {"id": customer.id}


@router.get("/customers")
def list_customers(tenant: str = Depends(current_tenant), db: Session = Depends(get_db)):
    rows = db.scalars(select(Customer).where(Customer.tenant_id == tenant)).all()
    return [{"id": r.id, "name": r.name, "phone": r.phone} for r in rows]
