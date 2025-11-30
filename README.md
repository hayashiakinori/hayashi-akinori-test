# Concerts API

NestJS + TypeORM service for managing concert schedules.

## Environment

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (use instead of individual fields) |
| `DB_TYPE` | `postgres` (default) or `sqlite` |
| `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` | Postgres connection pieces when `DATABASE_URL` is not supplied |
| `DB_PATH` | SQLite file path (defaults to `data/dev.db`) |
| `DB_SYNCHRONIZE` | Set to `true` in local/test to auto-sync tables (migrations recommended otherwise) |

## Commands

```bash
# install dependencies
npm install

# run migrations
npm run migration:run

# seed sample data
npm run seed

# start the server
npm run start:dev

# tests
npm test
npm run test:e2e
```
