-- Migration: Separate drivers from public.users
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
--
-- What this does:
--   1. Re-points drivers.user_id FK from public.users → auth.users directly
--   2. Updates handle_new_user trigger to skip public.users insert for driver role
--   3. Adds resilient exception handling to the trigger

-- ── Step 1: Re-wire the foreign key ──────────────────────────────────────────
-- Drop existing constraint (auto-named by Postgres)
alter table public.drivers
  drop constraint if exists drivers_user_id_fkey;

-- Point directly at auth.users — drivers no longer require a public.users row
alter table public.drivers
  add constraint drivers_user_id_fkey
  foreign key (user_id)
  references auth.users(id)
  on delete cascade;

-- ── Step 2: Update handle_new_user trigger ────────────────────────────────────
-- Only insert into public.users for non-driver roles.
-- Drivers are self-contained in public.drivers (user_id = auth.users.id).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Drivers have their own table — skip creating a public.users row
  if coalesce(new.raw_user_meta_data->>'role', 'user') = 'driver' then
    return new;
  end if;

  insert into public.users (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do update set
    email      = excluded.email,
    full_name  = coalesce(excluded.full_name, public.users.full_name),
    phone      = coalesce(excluded.phone,     public.users.phone),
    role       = excluded.role;

  return new;
exception when others then
  raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
  return new;
end;
$$;
