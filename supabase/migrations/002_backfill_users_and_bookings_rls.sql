-- Migration 002: Backfill public.users + tighten bookings RLS
-- Run in Supabase Dashboard → SQL Editor → New query
--
-- Why needed:
--   • Users who signed up before migration 001 (or without the trigger deployed)
--     have an auth.users row but no public.users row.
--   • This causes the bookings INSERT to fail (FK constraint on passenger_id).
--   • The trigger in 001 only fires on NEW inserts, not existing auth users.

-- ── 1. Re-ensure trigger is correct (idempotent) ─────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
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
    email     = excluded.email,
    full_name = coalesce(excluded.full_name, public.users.full_name),
    phone     = coalesce(excluded.phone,     public.users.phone),
    role      = excluded.role;
  return new;
exception when others then
  raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── 2. Backfill public.users for all non-driver auth users ───────────────────
insert into public.users (id, email, full_name, phone, role)
select
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name',
  au.raw_user_meta_data->>'phone',
  coalesce(nullif(au.raw_user_meta_data->>'role', 'driver'), 'user')
from auth.users au
where
  coalesce(au.raw_user_meta_data->>'role', 'user') != 'driver'
  and not exists (select 1 from public.users pu where pu.id = au.id)
on conflict (id) do nothing;

-- ── 3. Ensure bookings RLS allows insert when passenger_id = auth.uid() ──────
-- Drop and recreate to avoid duplicate policy errors
drop policy if exists "Passengers create bookings" on public.bookings;
create policy "Passengers create bookings" on public.bookings
  for insert with check (auth.uid() = passenger_id);

-- ── 4. Allow service role to bypass RLS for admin operations ─────────────────
drop policy if exists "Service role full access to bookings" on public.bookings;
create policy "Service role full access to bookings" on public.bookings
  for all using (auth.role() = 'service_role');

drop policy if exists "Service role full access to users" on public.users;
create policy "Service role full access to users" on public.users
  for all using (auth.role() = 'service_role');

-- ── 5. Allow authenticated users to upsert their own public.users row ─────────
-- This lets the client-side fallback in useUser work even without the trigger
drop policy if exists "Users can upsert own record" on public.users;
create policy "Users can upsert own record" on public.users
  for insert with check (auth.uid() = id);

-- (update policy already exists in schema.sql)
