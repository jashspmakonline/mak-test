"""Shared request checks. Replace the API key check with Cognito JWT verification later."""
from fastapi import Header, HTTPException

from .config import ADMIN_API_KEY


def current_tenant(x_tenant: str = Header("mak"), x_api_key: str = Header("")) -> str:
    if x_api_key != ADMIN_API_KEY:
        raise HTTPException(401, "bad api key")
    return x_tenant
