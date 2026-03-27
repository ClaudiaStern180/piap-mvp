-- Use the full SQL schema from the specification as the base migration.
-- This abbreviated starter keeps the key objects needed to begin implementation.

create extension if not exists pgcrypto;

create type user_role as enum ('clerk', 'po', 'admin');
create type main_status_type as enum ('IL0', 'IL1', 'IL2', 'IL3', 'IL4', 'IL5');
create type risk_status_type as enum ('green', 'yellow', 'red');
create type po_flag_status_type as enum ('none', 'review_required', 'critical', 'escalated');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role user_role not null default 'clerk',
  preferred_language text not null default 'en',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists areas (
  id uuid primary key default gen_random_uuid(),
  name_de text,
  name_en text not null,
  code text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name_de text,
  name_en text not null,
  code text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create sequence if not exists initiative_no_seq start 1001;

create table if not exists initiatives (
  id uuid primary key default gen_random_uuid(),
  initiative_no integer not null unique default nextval('initiative_no_seq'),
  title text not null,
  description text,
  area_id uuid not null references areas(id),
  category_id uuid not null references categories(id),
  owner_name text not null,
  sponsor_name text,
  wsl_name text,
  main_status main_status_type,
  risk_status risk_status_type,
  implementation_progress_pct numeric(5,2),
  start_date date,
  target_year integer not null,
  planned_savings_total numeric(14,2) not null,
  approved_savings numeric(14,2),
  investment_amount numeric(14,2),
  currency_code text not null default 'EUR',
  saving_type text,
  impact_on_oi boolean,
  risk_text text,
  mitigation_text text,
  next_steps text,
  management_comment text,
  po_flag_status po_flag_status_type not null default 'none',
  po_flag_note text,
  po_flagged_at timestamptz,
  po_flagged_by uuid references users(id),
  is_active boolean not null default true,
  created_by uuid references users(id),
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists monthly_updates (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid not null references initiatives(id) on delete cascade,
  reporting_year integer not null,
  reporting_month integer not null,
  planned_savings_month numeric(14,2),
  achieved_savings_month numeric(14,2),
  main_status main_status_type,
  risk_status risk_status_type,
  implementation_progress_pct numeric(5,2),
  comment_text text,
  risk_text text,
  mitigation_text text,
  next_steps text,
  updated_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (initiative_id, reporting_year, reporting_month)
);

create table if not exists initiative_log_entries (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid not null references initiatives(id) on delete cascade,
  entry_type text not null,
  text text not null,
  owner_name text,
  due_date date,
  status text,
  created_by uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists attachments (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid not null references initiatives(id) on delete cascade,
  file_name text not null,
  mime_type text,
  file_size_bytes bigint not null,
  storage_path text not null,
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now()
);
