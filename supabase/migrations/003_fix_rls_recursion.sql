-- Migration 003: Fix infinite RLS recursion on public.users (error 42P17)
-- Production-safe and idempotent — can be re-run at any time.
--
-- Key facts about the actual production schema:
--   • public.users.name  — text NOT NULL, no default  → must always be provided
--   • public.users.role  — user_role enum, DEFAULT 'ops'  → 'user' is INVALID
--   • public.users.full_name — text, nullable  → exists as a separate column
-- Run in Supabase Dashboard → SQL Editor → New query

-- ── 1. Create is_admin() — security definer bypasses RLS on public.users ──────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role::text = 'admin'
  )
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- ── 2. Fix public.users — drop recursive admin policy, recreate safely ─────────
DROP POLICY IF EXISTS "Admins read all users" ON public.users;

CREATE POLICY "Admins read all users" ON public.users
  FOR SELECT USING (public.is_admin());

-- ── 3. Fix public.bookings admin policy ───────────────────────────────────────
DROP POLICY IF EXISTS "Admins manage all bookings" ON public.bookings;

CREATE POLICY "Admins manage all bookings" ON public.bookings
  FOR ALL USING (public.is_admin());

-- ── 4. Fix public.drivers admin policy ───────────────────────────────────────
DROP POLICY IF EXISTS "Admins manage all drivers" ON public.drivers;

CREATE POLICY "Admins manage all drivers" ON public.drivers
  FOR ALL USING (public.is_admin());

-- ── 5. Clean up INSERT policy on users (idempotent) ──────────────────────────
DROP POLICY IF EXISTS "Users can insert own record" ON public.users;
DROP POLICY IF EXISTS "Users can upsert own record" ON public.users;

CREATE POLICY "Users can insert own record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ── 6. Redeploy handle_new_user trigger ──────────────────────────────────────
--   • name is NOT NULL → always computed from metadata or email prefix
--   • Regular users: role column omitted → Postgres uses DEFAULT 'ops'
--   • Admin users: role cast via EXECUTE to avoid hardcoding enum labels
--   • Drivers: skip entirely (live in public.drivers, not public.users)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role_text text;
  v_name      text;
BEGIN
  v_role_text := COALESCE(NEW.raw_user_meta_data->>'role', 'ops');

  -- name is NOT NULL — derive from metadata with email-prefix fallback
  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    split_part(NEW.email, '@', 1)
  );

  -- Drivers live in public.drivers — skip creating a public.users row
  IF v_role_text = 'driver' THEN
    RETURN NEW;
  END IF;

  IF v_role_text = 'admin' THEN
    EXECUTE format(
      'INSERT INTO public.users (id, email, name, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6::public.user_role)
       ON CONFLICT (id) DO UPDATE SET
         email     = EXCLUDED.email,
         name      = COALESCE(EXCLUDED.name,      public.users.name),
         full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
         phone     = COALESCE(EXCLUDED.phone,     public.users.phone),
         role      = EXCLUDED.role'
    ) USING NEW.id,
            NEW.email,
            v_name,
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'phone',
            v_role_text;
  ELSE
    -- Regular user: omit role so Postgres uses the column DEFAULT ('ops')
    INSERT INTO public.users (id, email, name, full_name, phone)
    VALUES (
      NEW.id,
      NEW.email,
      v_name,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO UPDATE SET
      email     = EXCLUDED.email,
      name      = COALESCE(EXCLUDED.name,      public.users.name),
      full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
      phone     = COALESCE(EXCLUDED.phone,     public.users.phone);
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 7. Backfill: insert missing rows for all non-driver auth users ─────────────
--   • name  is NOT NULL — computed from metadata with email-prefix fallback
--   • role  is omitted  — Postgres uses the column DEFAULT ('ops')
INSERT INTO public.users (id, email, name, full_name, phone)
SELECT
  au.id,
  au.email,
  COALESCE(
    NULLIF(TRIM(au.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(au.raw_user_meta_data->>'name'), ''),
    split_part(au.email, '@', 1)
  ),
  au.raw_user_meta_data->>'full_name',
  au.raw_user_meta_data->>'phone'
FROM auth.users au
WHERE
  COALESCE(au.raw_user_meta_data->>'role', '') != 'driver'
  AND NOT EXISTS (
    SELECT 1 FROM public.users pu WHERE pu.id = au.id
  )
ON CONFLICT (id) DO NOTHING;
