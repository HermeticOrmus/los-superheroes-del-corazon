-- Los Superhéroes del Corazón - Initial Schema
-- Uses Supabase Auth for user management

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('PARENT', 'CHILD', 'EDUCATOR', 'ADMIN');
CREATE TYPE child_rank AS ENUM ('INICIADO', 'VALIENTE', 'SABIO', 'MAESTRO');
CREATE TYPE difficulty_level AS ENUM ('BLANCO', 'ROJO', 'AZUL', 'DORADO');
CREATE TYPE completion_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE reward_type AS ENUM ('BADGE', 'PHYSICAL', 'DIGITAL', 'EXPERIENCE');
CREATE TYPE reward_rarity AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');
CREATE TYPE redemption_status AS ENUM ('PENDING', 'SHIPPED', 'DELIVERED');
CREATE TYPE event_type AS ENUM ('MEDITATION', 'STORYTELLING', 'CEREMONY', 'SPECIAL_GUEST');
CREATE TYPE post_type AS ENUM ('EXPERIENCE', 'QUESTION', 'CELEBRATION');
CREATE TYPE moderation_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE notification_type AS ENUM (
  'MISSION_RELEASED', 'CHALLENGE_COMPLETED', 'RANK_UP',
  'BADGE_EARNED', 'EVENT_REMINDER', 'SUBSCRIPTION_EXPIRING',
  'SYSTEM_ANNOUNCEMENT'
);
CREATE TYPE notification_recipient AS ENUM ('PARENT', 'CHILD', 'BOTH');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING');
CREATE TYPE subscription_plan AS ENUM ('FREE', 'PREMIUM');
CREATE TYPE payment_status AS ENUM ('PAID', 'FAILED', 'PENDING');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'PARENT',
  preferred_language TEXT DEFAULT 'es',
  timezone TEXT DEFAULT 'America/Mexico_City',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- ARCHANGELS (GUARDIANES)
-- ============================================

CREATE TABLE archangels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  power TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  illustration_url TEXT NOT NULL,
  "order" INTEGER UNIQUE NOT NULL
);

-- Public read access
ALTER TABLE archangels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Archangels are viewable by everyone" ON archangels
  FOR SELECT USING (true);

-- ============================================
-- CHILDREN
-- ============================================

CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  secret_code TEXT UNIQUE NOT NULL,
  superhero_name TEXT,
  archangel_id UUID REFERENCES archangels(id),
  avatar_url TEXT,
  luz_points INTEGER DEFAULT 100,
  rank child_rank DEFAULT 'INICIADO',
  initiation_completed BOOLEAN DEFAULT FALSE,
  country_code TEXT,
  requires_parent_assistance BOOLEAN DEFAULT TRUE,
  can_browse_community BOOLEAN DEFAULT FALSE,
  can_post_to_community BOOLEAN DEFAULT FALSE,
  can_view_global_map BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_children_parent ON children(parent_id);
CREATE INDEX idx_children_secret_code ON children(secret_code);

ALTER TABLE children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own children" ON children
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert own children" ON children
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update own children" ON children
  FOR UPDATE USING (auth.uid() = parent_id);

CREATE POLICY "Parents can delete own children" ON children
  FOR DELETE USING (auth.uid() = parent_id);

-- ============================================
-- MONTHLY MISSIONS
-- ============================================

CREATE TABLE monthly_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  video_reveal_url TEXT NOT NULL,
  archangel_id UUID REFERENCES archangels(id),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(year, month)
);

CREATE INDEX idx_missions_dates ON monthly_missions(start_date, end_date);

ALTER TABLE monthly_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Missions viewable by authenticated" ON monthly_missions
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- WEEKLY CHALLENGES
-- ============================================

CREATE TABLE weekly_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES monthly_missions(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 4),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  difficulty_level difficulty_level NOT NULL,
  luz_points_reward INTEGER NOT NULL,
  required_proof_types TEXT[] NOT NULL,
  "order" INTEGER NOT NULL
);

CREATE INDEX idx_challenges_mission ON weekly_challenges(mission_id);

ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Challenges viewable by authenticated" ON weekly_challenges
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- CHILD MISSION PROGRESS
-- ============================================

CREATE TABLE child_mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  mission_id UUID NOT NULL REFERENCES monthly_missions(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  completion_percentage INTEGER DEFAULT 0,
  UNIQUE(child_id, mission_id)
);

CREATE INDEX idx_progress_child ON child_mission_progress(child_id);

ALTER TABLE child_mission_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view own children progress" ON child_mission_progress
  FOR SELECT USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

CREATE POLICY "Parents can insert own children progress" ON child_mission_progress
  FOR INSERT WITH CHECK (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

CREATE POLICY "Parents can update own children progress" ON child_mission_progress
  FOR UPDATE USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- ============================================
-- CHILD CHALLENGE COMPLETIONS
-- ============================================

CREATE TABLE child_challenge_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES weekly_challenges(id) ON DELETE CASCADE,
  proof_urls TEXT[] NOT NULL,
  proof_type TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  status completion_status DEFAULT 'PENDING',
  moderator_notes TEXT,
  luz_points_awarded INTEGER DEFAULT 0
);

CREATE INDEX idx_completions_child ON child_challenge_completions(child_id);
CREATE INDEX idx_completions_status ON child_challenge_completions(status);

ALTER TABLE child_challenge_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage own children completions" ON child_challenge_completions
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- ============================================
-- REWARDS
-- ============================================

CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type reward_type NOT NULL,
  code TEXT UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  luz_points_cost INTEGER NOT NULL,
  icon_url TEXT NOT NULL,
  rarity reward_rarity NOT NULL,
  is_redeemable BOOLEAN DEFAULT TRUE,
  stock_count INTEGER
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rewards viewable by authenticated" ON rewards
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- CHILD REWARDS
-- ============================================

CREATE TABLE child_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES rewards(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  redemption_status redemption_status,
  shipping_info JSONB,
  metadata JSONB
);

CREATE INDEX idx_child_rewards_child ON child_rewards(child_id);

ALTER TABLE child_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage own children rewards" ON child_rewards
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- ============================================
-- LIVE EVENTS
-- ============================================

CREATE TABLE live_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_es TEXT NOT NULL,
  description_en TEXT NOT NULL,
  event_type event_type NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  video_url TEXT,
  is_recorded BOOLEAN DEFAULT FALSE,
  recording_url TEXT,
  max_participants INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_scheduled ON live_events(scheduled_at);

ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events viewable by authenticated" ON live_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================
-- EVENT PARTICIPANTS
-- ============================================

CREATE TABLE event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES live_events(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  attended BOOLEAN DEFAULT FALSE,
  luz_points_awarded INTEGER DEFAULT 100,
  UNIQUE(event_id, child_id)
);

CREATE INDEX idx_participants_child ON event_participants(child_id);

ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can manage own children participation" ON event_participants
  FOR ALL USING (
    child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- ============================================
-- COMMUNITY POSTS
-- ============================================

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  post_type post_type NOT NULL,
  moderation_status moderation_status DEFAULT 'PENDING',
  moderated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_author ON community_posts(author_id);
CREATE INDEX idx_posts_moderation ON community_posts(moderation_status);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved posts viewable by all authenticated" ON community_posts
  FOR SELECT USING (
    auth.role() = 'authenticated' AND moderation_status = 'APPROVED'
  );

CREATE POLICY "Parents can manage own children posts" ON community_posts
  FOR ALL USING (
    author_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
  );

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  recipient notification_recipient NOT NULL,
  title_es TEXT NOT NULL,
  title_en TEXT NOT NULL,
  message_es TEXT NOT NULL,
  message_en TEXT NOT NULL,
  action_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_child ON notifications(child_id);
CREATE INDEX idx_notifications_created ON notifications(created_at);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  status subscription_status DEFAULT 'TRIALING',
  plan subscription_plan DEFAULT 'FREE',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- PAYMENT HISTORY
-- ============================================

CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status payment_status NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_subscription ON payment_history(subscription_id);

ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payment_history
  FOR SELECT USING (
    subscription_id IN (SELECT id FROM subscriptions WHERE user_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'PARENT'
  );

  -- Create free trial subscription
  INSERT INTO public.subscriptions (user_id, status, plan, current_period_start, current_period_end)
  VALUES (
    NEW.id,
    'TRIALING',
    'FREE',
    NOW(),
    NOW() + INTERVAL '14 days'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generate unique secret code for children
CREATE OR REPLACE FUNCTION generate_secret_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate secret code before insert
CREATE OR REPLACE FUNCTION set_child_secret_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.secret_code IS NULL OR NEW.secret_code = '' THEN
    LOOP
      NEW.secret_code := generate_secret_code();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM children WHERE secret_code = NEW.secret_code);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_child
  BEFORE INSERT ON children
  FOR EACH ROW EXECUTE FUNCTION set_child_secret_code();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_children_updated_at
  BEFORE UPDATE ON children
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON community_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
