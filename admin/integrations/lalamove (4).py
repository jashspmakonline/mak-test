"""Lalamove delivery quote. Mock mode until LALAMOVE_KEY is set (riders and maps pending)."""
from fastapi import APIRouter, Depends, HTTPException

from ..config import LALAMOVE_KEY
from ..deps import current_tenant
from ..schemas import QuoteIn

router = APIRouter(prefix="/integrations/lalamove", tags=["integrations"])


@router.post("/quote")
def quote(body: QuoteIn, tenant: str = Depends(current_tenant)):
    if not LALAMOVE_KEY:
        return {"mode": "mock", "fee_myr": 8.50, "eta_min": 35}
    # TODO: real call goes here (signed request to the Lalamove API using LALAMOVE_KEY)
    raise HTTPException(501, "wire the real Lalamove call here")
