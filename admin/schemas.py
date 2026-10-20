"""Request body shapes (what the API accepts)."""
from pydantic import BaseModel


class CustomerIn(BaseModel):
    name: str
    phone: str = ""


class LedgerIn(BaseModel):
    order_ref: str = ""
    kind: str
    amount: float


class TicketIn(BaseModel):
    title: str


class TngEvent(BaseModel):
    order_ref: str
    amount: float
    status: str


class QuoteIn(BaseModel):
    pickup: str
    dropoff: str
