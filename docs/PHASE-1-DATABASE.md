# Phase 1 — Persistent Database + CRM Foundation

## What changed
The CRM no longer talks to a JSON file directly. All data access now goes through a
pluggable **async repository layer**:

```
API routes ──> lib/crm-db.ts (same function names) ──> lib/db/index.ts (driver select)
                                                         ├── lib/db/json-repo.ts      (dev)
                                                         └── lib/db/supabase-repo.ts  (production)
```

* **No new npm dependencies.** Supabase is accessed over its PostgREST HTTP API with
  `fetch`, which keeps the dependency tree free of native builds (your installs use
  `--ignore-scripts`) and avoids serverless connection-pool exhaustion.
* **Nothing breaks today.** With no Supabase env vars the app uses the existing local
  JSON store exactly as before — the website and CRM keep working.
* **Production becomes persistent** the moment the two Supabase variables are set.

## Driver selection
| Condition | Driver |
|---|---|
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` set | `supabase` (persistent) |
| otherwise | `json` (development only) |
| `DB_DRIVER=supabase\|json` | forces the driver |

## Setup (10 minutes)
1. Create a free project at **https://supabase.com**.
2. Open **SQL Editor** → paste all of `db/schema.sql` → **Run**.
   (Idempotent — safe to re-run.)
3. **Project Settings → API**, copy:
   * `Project URL`  → `SUPABASE_URL`
   * `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`
4. Add both to `.env.local` (local) and to **Vercel → Settings → Environment
   Variables → Production**, then redeploy.
5. Sign in to `/admin`, then:
   * `GET /api/admin/system/health` → confirms `driver: "supabase", persistent: true`
   * `POST /api/admin/system/migrate` → imports existing local leads (idempotent upsert by id)

## Security
* The **service-role key is server-side only** — it is never imported into a client
  component. All repository files start with `import "server-only"`.
* **RLS is enabled on every table with no public policies**, so the public anon key
  cannot read CRM data even if it leaks.
* `.gitignore` excludes `.env`, `.env.local`, `.env.*` (keeps `.env.example`).

## Tables created
`leads`, `lead_activities`, `messages`, `follow_ups`, `proposals`, `meetings`,
`clients`, `projects`, `tasks`, `payments`, `agent_runs`, `issues`,
`website_checks`, `approvals`.

`agent_runs`, `issues`, `website_checks` and `approvals` exist now so Phase 2
(agent framework) and Phase 3 (website monitoring) have somewhere to write.

## Note on scheduling (for Phase 9)
Vercel serverless functions are **not** long-running processes. Continuous agents will
be driven by **Vercel Cron / an external scheduler** hitting protected endpoints —
not by an in-process timer.
