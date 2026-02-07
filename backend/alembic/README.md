# Alembic Migrations

To initialize Alembic (if not already done):
```bash
alembic init alembic
```

To create a new migration:
```bash
alembic revision --autogenerate -m "Migration message"
```

To apply migrations:
```bash
alembic upgrade head
```
