-- Create polls table
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true,
  allow_multiple_votes BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create poll_options table
CREATE TABLE IF NOT EXISTS poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  -- Add a unique constraint to prevent duplicate votes (unless poll allows multiple votes)
  UNIQUE (user_id, option_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS polls_creator_id_idx ON polls (creator_id);
CREATE INDEX IF NOT EXISTS poll_options_poll_id_idx ON poll_options (poll_id);
CREATE INDEX IF NOT EXISTS votes_option_id_idx ON votes (option_id);
CREATE INDEX IF NOT EXISTS votes_user_id_idx ON votes (user_id);

-- Create RLS (Row Level Security) policies
-- Enable RLS on all tables
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Polls policies
-- 1. Users can view public polls
CREATE POLICY "Public polls are viewable by everyone" 
  ON polls FOR SELECT 
  USING (is_public = true);

-- 2. Users can view their own polls (even if private)
CREATE POLICY "Users can view their own polls" 
  ON polls FOR SELECT 
  USING (creator_id = auth.uid());

-- 3. Users can insert their own polls
CREATE POLICY "Users can create their own polls" 
  ON polls FOR INSERT 
  WITH CHECK (creator_id = auth.uid());

-- 4. Users can update their own polls
CREATE POLICY "Users can update their own polls" 
  ON polls FOR UPDATE 
  USING (creator_id = auth.uid());

-- 5. Users can delete their own polls
CREATE POLICY "Users can delete their own polls" 
  ON polls FOR DELETE 
  USING (creator_id = auth.uid());

-- Poll options policies
-- 1. Anyone can view options for public polls
CREATE POLICY "Anyone can view options for public polls" 
  ON poll_options FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE is_public = true
    )
  );

-- 2. Users can view options for their own polls
CREATE POLICY "Users can view options for their own polls" 
  ON poll_options FOR SELECT 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE creator_id = auth.uid()
    )
  );

-- 3. Users can insert options for their own polls
CREATE POLICY "Users can insert options for their own polls" 
  ON poll_options FOR INSERT 
  WITH CHECK (
    poll_id IN (
      SELECT id FROM polls WHERE creator_id = auth.uid()
    )
  );

-- 4. Users can update options for their own polls
CREATE POLICY "Users can update options for their own polls" 
  ON poll_options FOR UPDATE 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE creator_id = auth.uid()
    )
  );

-- 5. Users can delete options for their own polls
CREATE POLICY "Users can delete options for their own polls" 
  ON poll_options FOR DELETE 
  USING (
    poll_id IN (
      SELECT id FROM polls WHERE creator_id = auth.uid()
    )
  );

-- Votes policies
-- 1. Anyone can view votes for public polls
CREATE POLICY "Anyone can view votes for public polls" 
  ON votes FOR SELECT 
  USING (
    option_id IN (
      SELECT po.id FROM poll_options po
      JOIN polls p ON po.poll_id = p.id
      WHERE p.is_public = true
    )
  );

-- 2. Users can view votes for their own polls
CREATE POLICY "Users can view votes for their own polls" 
  ON votes FOR SELECT 
  USING (
    option_id IN (
      SELECT po.id FROM poll_options po
      JOIN polls p ON po.poll_id = p.id
      WHERE p.creator_id = auth.uid()
    )
  );

-- 3. Authenticated users can vote on public polls
CREATE POLICY "Authenticated users can vote on public polls" 
  ON votes FOR INSERT 
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    option_id IN (
      SELECT po.id FROM poll_options po
      JOIN polls p ON po.poll_id = p.id
      WHERE p.is_public = true
    )
  );

-- 4. Users can delete their own votes
CREATE POLICY "Users can delete their own votes" 
  ON votes FOR DELETE 
  USING (user_id = auth.uid());

-- Create function to check if a user has already voted on a poll
CREATE OR REPLACE FUNCTION has_user_voted_on_poll(poll_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  vote_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM votes v
    JOIN poll_options po ON v.option_id = po.id
    WHERE po.poll_id = poll_uuid AND v.user_id = user_uuid
  ) INTO vote_exists;
  
  RETURN vote_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get poll results
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  vote_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id AS option_id,
    po.option_text,
    COUNT(v.id) AS vote_count
  FROM 
    poll_options po
  LEFT JOIN 
    votes v ON po.id = v.option_id
  WHERE 
    po.poll_id = poll_uuid
  GROUP BY 
    po.id, po.option_text
  ORDER BY 
    vote_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;