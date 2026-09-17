-- ============================================================
--  KS DIGITAL STUDIO — AI Agency OS · Phase 1 schema
--  Paste into: Supabase → SQL Editor → Run
--  Safe to re-run (idempotent).
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- CRM core ----------
create table if not exists leads (
  id                text primary key,
  business_name     text not null,
  website           text,
  industry          text,
  location          text,
  contact_name      text,
  email             text,
  phone             text,
  website_score     int,
  lead_score        int  not null default 0,
  tier              text not null default 'cold',   -- hot | warm | cold
  status            text not null default 'new',    -- new|contacted|replied|qualified|proposal_sent|won|lost
  source            text not null default 'website',
  budget            text,
  timeline          text,
  estimated_value   numeric,
  notes             text,
  score_reasons     jsonb default '[]'::jsonb,
  services_needed   jsonb default '[]'::jsonb,
  audit             jsonb,
  last_contact      timestamptz,
  next_follow_up    timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists leads_status_idx     on leads(status);
create index if not exists leads_tier_idx       on leads(tier);
create index if not exists leads_created_idx    on leads(created_at desc);
create index if not exists leads_followup_idx   on leads(next_follow_up);

create table if not exists lead_activities (
  id          text primary key,
  lead_id     text not null references leads(id) on delete cascade,
  type        text not null,        -- created|status_change|note|email|call|meeting|audit|agent
  summary     text not null,
  meta        jsonb,
  actor       text default 'system',
  created_at  timestamptz not null default now()
);
create index if not exists lead_activities_lead_idx on lead_activities(lead_id, created_at desc);

create table if not exists messages (
  id          text primary key,
  lead_id     text not null references leads(id) on delete cascade,
  channel     text not null,        -- email|linkedin|whatsapp|proposal
  kind        text not null,        -- cold|followup|value|final|custom
  subject     text,
  body        text not null,
  status      text not null default 'draft',  -- draft|approved|sent
  created_at  timestamptz not null default now()
);
create index if not exists messages_lead_idx on messages(lead_id, created_at desc);

create table if not exists follow_ups (
  id          text primary key,
  lead_id     text not null references leads(id) on delete cascade,
  due_date    timestamptz not null,
  step        int not null default 0,
  channel     text not null default 'email',
  status      text not null default 'pending', -- pending|done|skipped
  created_at  timestamptz not null default now()
);
create index if not exists follow_ups_due_idx on follow_ups(status, due_date);

create table if not exists proposals (
  id            text primary key,
  lead_id       text references leads(id) on delete set null,
  client_name   text,
  business      text,
  requirements  text,
  solution      text,
  features      jsonb default '[]'::jsonb,
  timeline      text,
  investment    text,
  deliverables  jsonb default '[]'::jsonb,
  terms         jsonb default '[]'::jsonb,
  next_steps    jsonb default '[]'::jsonb,
  status        text not null default 'draft',   -- draft|approved|sent|accepted|rejected
  created_at    timestamptz not null default now()
);

create table if not exists meetings (
  id           text primary key,
  lead_id      text references leads(id) on delete set null,
  scheduled_at timestamptz,
  source       text default 'calendly',
  status       text not null default 'scheduled', -- scheduled|completed|no_show|cancelled
  notes        text,
  created_at   timestamptz not null default now()
);

-- ---------- Delivery ----------
create table if not exists clients (
  id          text primary key,
  lead_id     text references leads(id) on delete set null,
  name        text not null,
  business    text,
  email       text,
  phone       text,
  created_at  timestamptz not null default now()
);

create table if not exists projects (
  id             text primary key,
  client_id      text references clients(id) on delete set null,
  lead_id        text references leads(id) on delete set null,
  client_name    text,
  project_name   text not null,
  services       jsonb default '[]'::jsonb,
  start_date     date,
  deadline       date,
  status         text not null default 'new',  -- new|planning|design|development|testing|review|completed
  budget         numeric,
  payment_status text default 'unpaid',        -- unpaid|partial|paid
  notes          text,
  created_at     timestamptz not null default now()
);

create table if not exists tasks (
  id          text primary key,
  project_id  text references projects(id) on delete cascade,
  title       text not null,
  done        boolean not null default false,
  due_date    date,
  assignee    text,
  created_at  timestamptz not null default now()
);

create table if not exists payments (
  id          text primary key,
  project_id  text references projects(id) on delete cascade,
  amount      numeric not null,
  currency    text not null default 'INR',
  status      text not null default 'due',   -- due|paid|overdue
  due_date    date,
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- ---------- Agent framework (Phase 2/3 foundation) ----------
create table if not exists agent_runs (
  id            text primary key,
  agent         text not null,                  -- website_monitor|lead_engine|...
  status        text not null default 'running',-- running|ok|error|skipped
  started_at    timestamptz not null default now(),
  finished_at   timestamptz,
  duration_ms   int,
  items         int default 0,
  tokens_used   int default 0,
  error         text,
  summary       text,
  meta          jsonb
);
create index if not exists agent_runs_agent_idx on agent_runs(agent, started_at desc);

create table if not exists issues (
  id            text primary key,
  source        text not null default 'website_monitor',
  title         text not null,
  detail        text,
  severity      text not null default 'medium', -- critical|high|medium|low
  status        text not null default 'detected',
  -- detected|investigating|fix_proposed|awaiting_approval|fixed|verified|dismissed
  url           text,
  suggested_fix text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists issues_status_idx on issues(status, severity);

create table if not exists website_checks (
  id            text primary key,
  url           text not null,
  ok            boolean not null default false,
  http_status   int,
  response_ms   int,
  checked_at    timestamptz not null default now(),
  details       jsonb
);
create index if not exists website_checks_time_idx on website_checks(checked_at desc);

create table if not exists approvals (
  id          text primary key,
  kind        text not null,      -- code|content|email|whatsapp|proposal|pricing|seo|deployment
  title       text not null,
  payload     jsonb,
  status      text not null default 'pending', -- pending|approved|rejected
  created_at  timestamptz not null default now(),
  decided_at  timestamptz,
  decided_by  text
);
create index if not exists approvals_status_idx on approvals(status, created_at desc);

-- NOTE: access is via the service-role key from server-side code only.
-- RLS is enabled with no public policies so the anon key cannot read CRM data.
alter table leads            enable row level security;
alter table lead_activities  enable row level security;
alter table messages         enable row level security;
alter table follow_ups       enable row level security;
alter table proposals        enable row level security;
alter table meetings         enable row level security;
alter table clients          enable row level security;
alter table projects         enable row level security;
alter table tasks            enable row level security;
alter table payments         enable row level security;
alter table agent_runs       enable row level security;
alter table issues           enable row level security;
alter table website_checks   enable row level security;
alter table approvals        enable row level security;

-- ============================================================
--  Phase 3 — Own booking / scheduling system (replaces Calendly)
-- ============================================================

create table if not exists meeting_types (
  id            text primary key,
  slug          text unique not null,
  name          text not null,
  duration_min  int  not null default 30,
  description   text,
  location_type text not null default 'google_meet', -- google_meet|zoom|phone|whatsapp|in_person|custom
  meeting_url   text,
  enabled       boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

-- one row per weekday (0=Sun .. 6=Sat); multiple rows allow split shifts
create table if not exists availability_rules (
  id          text primary key,
  weekday     int  not null check (weekday between 0 and 6),
  start_min   int  not null,  -- minutes from midnight, local timezone
  end_min     int  not null,
  enabled     boolean not null default true
);

create table if not exists blocked_times (
  id          text primary key,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  reason      text,
  created_at  timestamptz not null default now()
);
create index if not exists blocked_times_range_idx on blocked_times(starts_at, ends_at);

create table if not exists bookings (
  id              text primary key,
  public_code     text unique not null,      -- shown to client, e.g. KSD-4F2A9C
  manage_token    text unique not null,      -- secure reschedule/cancel link
  meeting_type    text not null,             -- slug snapshot
  duration_min    int  not null,
  lead_id         text references leads(id) on delete set null,
  name            text not null,
  email           text not null,
  phone           text,
  company         text,
  website         text,
  requirement     text,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  timezone        text not null default 'Asia/Kolkata',
  location_type   text not null default 'google_meet',
  meeting_url     text,
  status          text not null default 'confirmed', -- confirmed|cancelled|completed|no_show|rescheduled
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists bookings_start_idx  on bookings(starts_at);
create index if not exists bookings_status_idx on bookings(status);

-- DOUBLE-BOOKING PROTECTION (database-level):
-- no two ACTIVE bookings may share the same start instant.
create unique index if not exists bookings_no_double_book
  on bookings (starts_at)
  where status in ('confirmed', 'rescheduled');

create table if not exists booking_settings (
  id                text primary key default 'default',
  timezone          text not null default 'Asia/Kolkata',
  utc_offset_min    int  not null default 330,   -- IST = +5:30
  min_notice_min    int  not null default 120,
  max_window_days   int  not null default 30,
  buffer_before_min int  not null default 0,
  buffer_after_min  int  not null default 15,
  slot_step_min     int  not null default 30,
  default_location  text not null default 'google_meet',
  default_meeting_url text,
  updated_at        timestamptz not null default now()
);

alter table meeting_types      enable row level security;
alter table availability_rules enable row level security;
alter table blocked_times      enable row level security;
alter table bookings           enable row level security;
alter table booking_settings   enable row level security;

-- Seed defaults (safe to re-run)
insert into booking_settings (id) values ('default') on conflict (id) do nothing;

insert into meeting_types (id, slug, name, duration_min, description, sort_order) values
  ('mt_discovery',    'discovery-15',    '15 Minute Discovery',          15, 'A quick intro call to understand your goals.', 1),
  ('mt_consultation', 'consultation-30', '30 Minute Consultation',       30, 'Discuss your project requirements in detail.', 2),
  ('mt_project',      'project-60',      '60 Minute Project Consultation',60, 'Deep dive: scope, timeline and investment.',   3)
on conflict (slug) do nothing;

-- Mon–Fri 09:00–17:00 (540–1020 minutes); weekends unavailable
insert into availability_rules (id, weekday, start_min, end_min, enabled) values
  ('av_mon', 1, 540, 1020, true),
  ('av_tue', 2, 540, 1020, true),
  ('av_wed', 3, 540, 1020, true),
  ('av_thu', 4, 540, 1020, true),
  ('av_fri', 5, 540, 1020, true),
  ('av_sat', 6, 540, 1020, false),
  ('av_sun', 0, 540, 1020, false)
on conflict (id) do nothing;
