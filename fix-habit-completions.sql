-- Fix for 406 Not Acceptable error in habit_completions
-- Run this in your Supabase SQL Editor

-- First, let's check the current state
SELECT 'Current tables:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('habits', 'habit_completions');

-- Check RLS policies
SELECT 'Current RLS policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('habits', 'habit_completions');

-- Drop and recreate habit_completions table with proper structure
DROP TABLE IF EXISTS habit_completions CASCADE;

CREATE TABLE habit_completions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- Add foreign key constraints
ALTER TABLE habit_completions 
ADD CONSTRAINT fk_habit_completions_habit_id 
FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE;

ALTER TABLE habit_completions 
ADD CONSTRAINT fk_habit_completions_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can insert their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can update their own habit completions" ON habit_completions;
DROP POLICY IF EXISTS "Users can delete their own habit completions" ON habit_completions;

-- Create comprehensive security policies
CREATE POLICY "Users can view their own habit completions" ON habit_completions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habit completions" ON habit_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habit completions" ON habit_completions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habit completions" ON habit_completions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_id ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_user_id ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_completions_date ON habit_completions(date);
CREATE INDEX IF NOT EXISTS idx_habit_completions_habit_date ON habit_completions(habit_id, date);

-- Grant necessary permissions
GRANT ALL ON habit_completions TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Test the setup
SELECT 'Testing habit_completions table:' as info;
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'habit_completions' 
ORDER BY ordinal_position;

-- Verify RLS is enabled
SELECT 'RLS status:' as info;
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'habit_completions';

-- Show final policies
SELECT 'Final policies:' as info;
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'habit_completions'; 