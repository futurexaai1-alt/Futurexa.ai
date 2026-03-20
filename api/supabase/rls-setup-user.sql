-- RLS + profile auto-creation for public."User"
-- Run in Supabase SQL Editor (order matters).

-- Allow authenticated users to query and write the profile table
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public."User" TO authenticated;

-- Enable RLS on the profile table
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;

-- Only allow users to select their own profile
DROP POLICY IF EXISTS "User select own profile" ON public."User";
CREATE POLICY "User select own profile"
ON public."User"
FOR SELECT
USING (id = auth.uid());

-- Only allow users to insert their own profile row
DROP POLICY IF EXISTS "User insert own profile" ON public."User";
CREATE POLICY "User insert own profile"
ON public."User"
FOR INSERT
WITH CHECK (id = auth.uid());

-- Only allow users to update their own profile row
DROP POLICY IF EXISTS "User update own profile" ON public."User";
CREATE POLICY "User update own profile"
ON public."User"
FOR UPDATE
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Auto-create/keep the profile row in public."User" whenever a Supabase auth.users row is created.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User"(id, email, name, "updatedAt")
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    CURRENT_TIMESTAMP
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public."User".name),
    "updatedAt" = CURRENT_TIMESTAMP;

  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_auth_user();

