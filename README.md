# PIAP MVP Starter v4

This version keeps the mock mode from v3, but adds a real PostgreSQL repository layer and local attachment storage for development.

## Added in v4
- `lib/db.ts` with PostgreSQL pool handling
- repository functions now support **PostgreSQL or mock mode**
- automatic mode switch:
  - `USE_MOCK_DATA=true` -> mock mode
  - otherwise uses `DATABASE_URL`
- local attachment file storage via `lib/storage.ts`
- attachment download now serves stored files when available
- dashboard summary and monthly chart routes support query filters
- export routes continue to work with either mock or PostgreSQL data

## New environment variables
Create a `.env.local` file like this:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/piap
# optional: force mock mode during UI work
USE_MOCK_DATA=false
# optional: local attachment storage directory
ATTACHMENTS_DIR=.uploads
```

## Recommended local setup
1. Install dependencies
   ```bash
   npm install
   ```
2. Create a PostgreSQL database
3. Run the SQL schema from `database/schema.sql`
4. Set `DATABASE_URL` in `.env.local`
5. Start the app
   ```bash
   npm run dev
   ```

## Current state after v4
- repository layer is PostgreSQL-ready for the main MVP entities
- attachment uploads are stored locally for development
- auth is still a simple stub in `lib/auth.ts`
- pages are still intentionally lightweight and should be connected to forms next

## Best next coding step
1. replace the auth stub with real session handling
2. build initiative create/edit forms in the UI
3. add pagination and filter UI controls
4. optionally move attachment storage from local disk to S3/Supabase Storage


## Demo login added in v6

Open `/login` and choose one of the demo roles:
- clerk
- po
- admin

A cookie-based demo session is created automatically.

## New in v6

- demo login/logout with cookie session
- middleware redirect to `/login` when no session is present
- role-aware sidebar navigation
- dashboard filters for target year, area and category
- initiative list filters for search, area, category, owner, status and risk
- PO review filters and role guard
