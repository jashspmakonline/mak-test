"""All settings come from env vars, so the same image runs locally and on AWS."""
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mak.db")
# RDS example: mysql+pymysql://admin:PASSWORD@<rds-endpoint>:3306/mak

ADMIN_API_KEY = os.getenv("ADMIN_API_KEY", "dev-key")  # swap for Cognito JWT later
LALAMOVE_KEY = os.getenv("LALAMOVE_KEY")  # unset = mock mode
