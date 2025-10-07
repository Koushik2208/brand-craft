/*
  # BrandCraft Complete Database Schema

  ## Overview
  This migration creates all necessary tables for the BrandCraft application including user profiles, 
  onboarding data, content generation, and analytics tracking.

  ## New Tables

  ### 1. `user_profiles`
  Stores core user profile information collected during onboarding
  - `id` (uuid, primary key) - Unique identifier for the profile
  - `user_id` (uuid, foreign key) - References auth.users, one-to-one relationship
  - `full_name` (text) - User's full name
  - `company_name` (text, optional) - Company or organization name
  - `role` (text, optional) - User's job role or position
  - `industry` (text, optional) - Industry sector
  - `onboarding_completed` (boolean) - Whether user has completed onboarding
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `onboarding_responses`
  Stores detailed onboarding questionnaire responses for personalized content
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `content_goals` (text[]) - Array of content generation goals
  - `target_audience` (text) - Description of target audience
  - `content_tone` (text) - Preferred tone (professional, casual, friendly, etc.)
  - `topics_of_interest` (text[]) - Array of topics user is interested in
  - `content_frequency` (text) - How often they plan to generate content
  - `additional_preferences` (jsonb) - Flexible field for any additional preferences
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `generated_content`
  Stores all AI-generated content created by users
  - `id` (uuid, primary key) - Unique identifier for the content
  - `user_id` (uuid, foreign key) - References auth.users
  - `title` (text) - Content title or headline
  - `content` (text) - The actual generated content
  - `content_type` (text) - Type of content (social_post, blog_article, email, etc.)
  - `platform` (text, optional) - Target platform (twitter, linkedin, instagram, etc.)
  - `tone` (text) - Tone used for generation
  - `topics` (text[]) - Topics covered in the content
  - `status` (text) - Status (draft, published, archived)
  - `word_count` (integer) - Number of words in the content
  - `is_favorite` (boolean) - Whether user favorited this content
  - `metadata` (jsonb) - Additional metadata (hashtags, images, links, etc.)
  - `created_at` (timestamptz) - When content was generated
  - `updated_at` (timestamptz) - Last modification timestamp
  - `published_at` (timestamptz, optional) - When content was published

  ### 4. `content_templates`
  Stores user-created or system templates for content generation
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key, optional) - References auth.users (null for system templates)
  - `name` (text) - Template name
  - `description` (text) - Template description
  - `template_type` (text) - Type of template (system, user_custom)
  - `content_structure` (jsonb) - Template structure and prompts
  - `is_public` (boolean) - Whether template is public
  - `usage_count` (integer) - How many times template has been used
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 5. `user_analytics`
  Tracks user engagement and content performance metrics
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `content_id` (uuid, foreign key, optional) - References generated_content
  - `metric_type` (text) - Type of metric (content_generated, views, engagement, etc.)
  - `metric_value` (integer) - The metric value
  - `date` (date) - Date of the metric
  - `metadata` (jsonb) - Additional metric data
  - `created_at` (timestamptz) - Record creation timestamp

  ### 6. `user_settings`
  Stores user preferences and application settings
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `theme` (text) - UI theme preference
  - `notifications_enabled` (boolean) - Email notification preference
  - `auto_save` (boolean) - Auto-save content drafts
  - `default_tone` (text) - Default content tone
  - `default_platform` (text) - Default target platform
  - `ai_creativity_level` (text) - AI creativity setting (low, medium, high)
  - `preferences` (jsonb) - Additional user preferences
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Policies enforce authentication and ownership checks
  - System templates are readable by all authenticated users

  ## Indexes
  - Performance indexes on foreign keys and frequently queried columns
  - Composite indexes for analytics queries

  ## Important Notes
  1. All tables connect to auth.users via user_id
  2. Timestamps are automatically managed with triggers
  3. Arrays and JSONB provide flexibility for complex data
  4. Status enums ensure data consistency
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  company_name text,
  role text,
  industry text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS onboarding_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_goals text[] DEFAULT '{}',
  target_audience text,
  content_tone text DEFAULT 'professional',
  topics_of_interest text[] DEFAULT '{}',
  content_frequency text DEFAULT 'weekly',
  additional_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create generated_content table
CREATE TABLE IF NOT EXISTS generated_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  content_type text NOT NULL DEFAULT 'social_post',
  platform text,
  tone text NOT NULL,
  topics text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  word_count integer DEFAULT 0,
  is_favorite boolean DEFAULT false,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Create content_templates table
CREATE TABLE IF NOT EXISTS content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  template_type text NOT NULL DEFAULT 'user_custom',
  content_structure jsonb NOT NULL,
  is_public boolean DEFAULT false,
  usage_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id uuid REFERENCES generated_content(id) ON DELETE SET NULL,
  metric_type text NOT NULL,
  metric_value integer NOT NULL DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'dark',
  notifications_enabled boolean DEFAULT true,
  auto_save boolean DEFAULT true,
  default_tone text DEFAULT 'professional',
  default_platform text,
  ai_creativity_level text DEFAULT 'medium',
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for onboarding_responses
CREATE POLICY "Users can view own onboarding responses"
  ON onboarding_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding responses"
  ON onboarding_responses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding responses"
  ON onboarding_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own onboarding responses"
  ON onboarding_responses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for generated_content
CREATE POLICY "Users can view own content"
  ON generated_content FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content"
  ON generated_content FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content"
  ON generated_content FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own content"
  ON generated_content FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for content_templates
CREATE POLICY "Users can view own and public templates"
  ON content_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR is_public = true OR user_id IS NULL);

CREATE POLICY "Users can insert own templates"
  ON content_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own templates"
  ON content_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON content_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_analytics
CREATE POLICY "Users can view own analytics"
  ON user_analytics FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
  ON user_analytics FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON user_analytics FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analytics"
  ON user_analytics FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings"
  ON user_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding_completed ON user_profiles(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id ON onboarding_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_user_id ON generated_content(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_content_status ON generated_content(status);
CREATE INDEX IF NOT EXISTS idx_generated_content_created_at ON generated_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generated_content_is_favorite ON generated_content(is_favorite);
CREATE INDEX IF NOT EXISTS idx_content_templates_user_id ON content_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_content_templates_is_public ON content_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON user_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_content_id ON user_analytics(content_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_generated_content_user_status ON generated_content(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_date ON user_analytics(user_id, date DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at on all relevant tables
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_onboarding_responses_updated_at
  BEFORE UPDATE ON onboarding_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at
  BEFORE UPDATE ON generated_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_templates_updated_at
  BEFORE UPDATE ON content_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically calculate word count
CREATE OR REPLACE FUNCTION calculate_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = array_length(regexp_split_to_array(trim(NEW.content), '\s+'), 1);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-calculate word count
CREATE TRIGGER calculate_content_word_count
  BEFORE INSERT OR UPDATE OF content ON generated_content
  FOR EACH ROW
  EXECUTE FUNCTION calculate_word_count();
