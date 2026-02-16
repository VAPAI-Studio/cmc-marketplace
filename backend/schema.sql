-- CMC IP Marketplace - Database Schema
-- Created: 2026-02-16
-- Supabase PostgreSQL

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('creator', 'buyer', 'admin')),
  display_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  company_name TEXT, -- for buyers

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IP Listings table
CREATE TABLE ip_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Basic Info
  title TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  slug TEXT UNIQUE, -- for URLs

  -- Classification
  genre TEXT NOT NULL, -- Drama, Action, Comedy, Horror, Sci-Fi, Thriller, etc.
  format TEXT NOT NULL, -- Series, Film, Limited Series, Short
  tier TEXT DEFAULT 'hidden-gem' CHECK (tier IN ('flagship', 'strong', 'hidden-gem')),

  -- Setting & Context
  period TEXT, -- Ancient, Medieval, Modern, Future, etc.
  location TEXT, -- Country/region
  world_type TEXT, -- Historical, Contemporary, Fantasy, Sci-Fi
  themes TEXT[], -- ['revenge', 'family', 'survival']
  target_audience TEXT,

  -- Market Data
  comparables TEXT[], -- ["Breaking Bad", "Game of Thrones"]
  logline TEXT,

  -- Rights Information
  rights_holder TEXT,
  rights_holder_contact TEXT,
  available_rights TEXT[], -- ['Film', 'TV', 'Streaming', 'Theatrical']
  available_territories TEXT[], -- ['Worldwide', 'LATAM', 'USA', 'Europe']

  -- Content
  script_url TEXT, -- Supabase Storage URL
  synopsis_url TEXT,
  poster_url TEXT,
  concept_art_urls TEXT[],

  -- AI Analysis (denormalized for quick access)
  ai_analysis_status TEXT DEFAULT 'pending' CHECK (ai_analysis_status IN ('pending', 'analyzing', 'ready', 'failed')),
  ai_score DECIMAL(3,1), -- 1.0 to 10.0
  ai_strengths TEXT[],
  ai_improvements TEXT[],

  -- Status & Visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'archived')),
  featured BOOLEAN DEFAULT FALSE,

  -- Stats (denormalized)
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IP Materials table (AI-generated content)
CREATE TABLE ip_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES ip_listings(id) ON DELETE CASCADE,

  type TEXT NOT NULL CHECK (type IN ('analysis', 'one_pager', 'pitch_deck', 'mood_board')),
  content JSONB NOT NULL, -- structured data
  markdown_content TEXT, -- for one-pagers
  pdf_url TEXT, -- generated PDFs

  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  model_used TEXT, -- 'claude-sonnet-4-5' etc.
  tokens_used INTEGER,
  cost_usd DECIMAL(8,4)
);

-- Subscriptions table (for future monetization)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  tier TEXT NOT NULL CHECK (tier IN ('free', 'standard', 'business', 'professional')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'paused')),

  -- Limits
  max_ips INTEGER DEFAULT 3,
  max_ai_analyses INTEGER DEFAULT 1,

  -- Billing
  stripe_subscription_id TEXT,
  price_usd DECIMAL(10,2),
  period_end TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inquiries table (buyer → creator contact)
CREATE TABLE inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES ip_listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,

  message TEXT NOT NULL,
  buyer_contact_email TEXT NOT NULL,
  buyer_contact_phone TEXT,
  buyer_company TEXT,

  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  creator_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUPPORTING TABLES
-- =====================================================

-- Favorites (buyers save IPs)
CREATE TABLE favorites (
  buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES ip_listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (buyer_id, listing_id)
);

-- IP Views (analytics)
CREATE TABLE ip_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES ip_listings(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES users(id) ON DELETE SET NULL, -- nullable for anonymous
  source TEXT, -- 'search', 'browse', 'featured', 'direct'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- IP Listings
CREATE INDEX idx_listings_creator ON ip_listings(creator_id);
CREATE INDEX idx_listings_status ON ip_listings(status);
CREATE INDEX idx_listings_genre ON ip_listings(genre);
CREATE INDEX idx_listings_tier ON ip_listings(tier);
CREATE INDEX idx_listings_slug ON ip_listings(slug);
CREATE INDEX idx_listings_created ON ip_listings(created_at DESC);
CREATE INDEX idx_listings_themes ON ip_listings USING GIN(themes);
CREATE INDEX idx_listings_search ON ip_listings USING GIN(to_tsvector('english', title || ' ' || description));

-- IP Materials
CREATE INDEX idx_materials_listing ON ip_materials(listing_id);
CREATE INDEX idx_materials_type ON ip_materials(type);

-- Inquiries
CREATE INDEX idx_inquiries_listing ON inquiries(listing_id);
CREATE INDEX idx_inquiries_buyer ON inquiries(buyer_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);

-- Favorites
CREATE INDEX idx_favorites_buyer ON favorites(buyer_id);
CREATE INDEX idx_favorites_listing ON favorites(listing_id);

-- Views
CREATE INDEX idx_views_listing ON ip_views(listing_id);
CREATE INDEX idx_views_created ON ip_views(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_views ENABLE ROW LEVEL SECURITY;

-- Users: users can view and update their own profile
CREATE POLICY users_own ON users
  FOR ALL USING (auth.uid() = id);

-- Users: everyone can view basic user info (for displaying creator names)
CREATE POLICY users_public_read ON users
  FOR SELECT USING (true);

-- IP Listings: creators can manage their own IPs
CREATE POLICY listings_creator_all ON ip_listings
  FOR ALL USING (auth.uid() = creator_id);

-- IP Listings: published IPs are visible to everyone
CREATE POLICY listings_public_read ON ip_listings
  FOR SELECT USING (status = 'published');

-- IP Listings: admins can see all
CREATE POLICY listings_admin_all ON ip_listings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- IP Materials: visible to creator and admins
CREATE POLICY materials_creator_read ON ip_materials
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ip_listings
      WHERE ip_listings.id = ip_materials.listing_id
      AND ip_listings.creator_id = auth.uid()
    )
  );

CREATE POLICY materials_admin_all ON ip_materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Subscriptions: users can view their own subscription
CREATE POLICY subscriptions_own ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Inquiries: buyer sees their own, creator sees inquiries for their IPs
CREATE POLICY inquiries_buyer_own ON inquiries
  FOR ALL USING (auth.uid() = buyer_id);

CREATE POLICY inquiries_creator_read ON inquiries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ip_listings
      WHERE ip_listings.id = inquiries.listing_id
      AND ip_listings.creator_id = auth.uid()
    )
  );

-- Inquiries: admins can see all
CREATE POLICY inquiries_admin_all ON inquiries
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Favorites: users can manage their own favorites
CREATE POLICY favorites_own ON favorites
  FOR ALL USING (auth.uid() = buyer_id);

-- IP Views: anyone can insert (for analytics), users can view their own
CREATE POLICY views_public_insert ON ip_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY views_creator_read ON ip_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ip_listings
      WHERE ip_listings.id = ip_views.listing_id
      AND ip_listings.creator_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON ip_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate slug from title
CREATE OR REPLACE FUNCTION generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := trim(both '-' from NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_listing_slug BEFORE INSERT OR UPDATE ON ip_listings
  FOR EACH ROW EXECUTE FUNCTION generate_slug();

-- =====================================================
-- STORAGE BUCKETS (to create in Supabase UI)
-- =====================================================

-- Bucket: ip-materials
-- Path structure: {listing_id}/{type}/{filename}
-- Public: false (use signed URLs)
-- File size limit: 50MB
-- Allowed types: PDF, PNG, JPG, WEBP

-- =====================================================
-- INITIAL DATA (to be added after setup)
-- =====================================================

-- Create default subscription tiers (optional for MVP)
-- INSERT INTO subscriptions (user_id, tier, status, max_ips, max_ai_analyses)
-- VALUES (...);
