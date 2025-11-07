-- Migration: Fix infinite recursion in RLS policies for squad_members and challenges
-- Date: 2025-01-03
-- Issue: Policies were causing infinite recursion when querying each other

-- Step 1: Create security definer functions (bypasses RLS to prevent recursion)

-- Function to check if user is challenge creator
CREATE OR REPLACE FUNCTION public.is_challenge_creator(challenge_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.challenges
    WHERE id = challenge_id_param AND creator_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user email (bypasses RLS for auth.users access)
CREATE OR REPLACE FUNCTION public.get_user_email(user_id_param UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = user_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Drop existing policies that have recursion issues
DROP POLICY IF EXISTS "Squad members viewable by challenge participants" ON public.squad_members;
DROP POLICY IF EXISTS "Challenge creators can invite squad members" ON public.squad_members;
DROP POLICY IF EXISTS "Challenges viewable by creator and squad" ON public.challenges;

-- Step 3: Recreate policies with fixed versions (no recursion)

-- Squad members SELECT policy (fixed - uses security definer function)
CREATE POLICY "Squad members viewable by challenge participants"
  ON public.squad_members FOR SELECT
  USING (
    user_id = auth.uid()
    OR email = public.get_user_email(auth.uid())
    OR public.is_challenge_creator(challenge_id, auth.uid())
  );

-- Squad members INSERT policy (fixed - uses security definer function)
CREATE POLICY "Challenge creators can invite squad members"
  ON public.squad_members FOR INSERT
  WITH CHECK (
    public.is_challenge_creator(challenge_id, auth.uid())
  );

-- Challenges SELECT policy (fixed - checks email for pending invitations)
CREATE POLICY "Challenges viewable by creator and squad"
  ON public.challenges FOR SELECT
  USING (
    auth.uid() = creator_id
    OR EXISTS (
      SELECT 1 FROM public.squad_members
      WHERE challenge_id = id 
      AND (user_id = auth.uid() OR email = public.get_user_email(auth.uid()))
      AND status = 'accepted'
    )
  );

