# Concerts API

NestJS + TypeORM API for managing concert schedules.

## Environment

- `DATABASE_URL`: Postgres connection string (e.g. `postgres://user:pass@localhost:5432/concerts`).
- `DB_TYPE`: `postgres` (default) or `sqlite` for local development.
- `SQLITE_PATH`: SQLite file path when `DB_TYPE=sqlite` (defaults to `concerts.sqlite`).

## Setup

```bash
npm install
npm run migration:run
npm run seed
npm run start:dev
```

## Testing

```bash
npm test
npm run test:e2e
```

## Migrations & Seeds

- `npm run migration:run` – apply migrations.
- `npm run migration:revert` – rollback.
- `npm run seed` – populate sample concerts (one per status) with sample performers and attachments.
