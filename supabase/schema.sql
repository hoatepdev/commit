-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenges table
CREATE TABLE public.challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stake_amount DECIMAL(10, 2) NOT NULL CHECK (stake_amount > 0),
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
  required_proofs INTEGER NOT NULL CHECK (required_proofs > 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'failed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'distributed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (end_date > start_date)
);

-- Squad members (accountability partners)
CREATE TABLE public.squad_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  CHECK ((user_id IS NOT NULL) OR (email IS NOT NULL))
);

-- Proofs table
CREATE TABLE public.proofs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  proof_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'disputed', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disputes table
CREATE TABLE public.disputes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  proof_id UUID REFERENCES public.proofs(id) ON DELETE CASCADE NOT NULL,
  disputer_id UUID REFERENCES public.profiles(id) NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'dismissed')),
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('stake', 'refund', 'payout')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  polar_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_challenges_creator_id ON public.challenges(creator_id);
CREATE INDEX idx_challenges_status ON public.challenges(status);
CREATE INDEX idx_squad_members_challenge_id ON public.squad_members(challenge_id);
CREATE INDEX idx_squad_members_user_id ON public.squad_members(user_id);
CREATE INDEX idx_proofs_challenge_id ON public.proofs(challenge_id);
CREATE INDEX idx_proofs_user_id ON public.proofs(user_id);
CREATE INDEX idx_proofs_status ON public.proofs(status);
CREATE INDEX idx_disputes_proof_id ON public.disputes(proof_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Challenges policies
CREATE POLICY "Challenges viewable by creator and squad"
  ON public.challenges FOR SELECT
  USING (
    auth.uid() = creator_id
    OR auth.uid() IN (
      SELECT user_id FROM public.squad_members
      WHERE challenge_id = id AND status = 'accepted'
    )
  );

CREATE POLICY "Users can create challenges"
  ON public.challenges FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own challenges"
  ON public.challenges FOR UPDATE
  USING (auth.uid() = creator_id);

-- Squad members policies
CREATE POLICY "Squad members viewable by challenge participants"
  ON public.squad_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.challenges
      WHERE id = challenge_id
      AND (creator_id = auth.uid() OR auth.uid() IN (
        SELECT user_id FROM public.squad_members sm2
        WHERE sm2.challenge_id = challenge_id
      ))
    )
  );

CREATE POLICY "Challenge creators can invite squad members"
  ON public.squad_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.challenges
      WHERE id = challenge_id AND creator_id = auth.uid()
    )
  );

-- Proofs policies
CREATE POLICY "Proofs viewable by challenge participants"
  ON public.proofs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.challenges
      WHERE id = challenge_id
      AND (creator_id = auth.uid() OR auth.uid() IN (
        SELECT user_id FROM public.squad_members
        WHERE challenge_id = proofs.challenge_id AND status = 'accepted'
      ))
    )
  );

CREATE POLICY "Challenge creators can create proofs"
  ON public.proofs FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.challenges
      WHERE id = challenge_id AND creator_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Functions

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proofs_updated_at BEFORE UPDATE ON public.proofs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
