-- Seed script for testing the ALX Poll application
-- This script inserts sample data into the database for development and testing

-- Clear existing data (if any)
TRUNCATE TABLE votes CASCADE;
TRUNCATE TABLE poll_options CASCADE;
TRUNCATE TABLE polls CASCADE;

-- Insert sample users (if using auth.users directly)
-- Note: In a real application, users would be created through the authentication system
-- This is just for reference and might need to be adjusted based on your auth setup

-- Insert sample polls
INSERT INTO polls (id, title, description, creator_id, is_public, allow_multiple_votes, created_at, updated_at, expires_at)
VALUES 
  -- Public polls
  ('11111111-1111-1111-1111-111111111111', 'Favorite Programming Language', 'What programming language do you enjoy working with the most?', auth.uid(), true, false, NOW(), NOW(), NOW() + INTERVAL '30 days'),
  ('22222222-2222-2222-2222-222222222222', 'Best Frontend Framework', 'Which frontend framework do you prefer?', auth.uid(), true, false, NOW(), NOW(), NOW() + INTERVAL '30 days'),
  ('33333333-3333-3333-3333-333333333333', 'Preferred Database', 'Which database system do you prefer to work with?', auth.uid(), true, true, NOW(), NOW(), NOW() + INTERVAL '30 days'),
  
  -- Private poll
  ('44444444-4444-4444-4444-444444444444', 'Team Meeting Time', 'When should we schedule our weekly team meeting?', auth.uid(), false, false, NOW(), NOW(), NOW() + INTERVAL '7 days');

-- Insert poll options
INSERT INTO poll_options (id, poll_id, option_text, created_at, updated_at)
VALUES
  -- Options for Favorite Programming Language
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'JavaScript', NOW(), NOW()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Python', NOW(), NOW()),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Java', NOW(), NOW()),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'TypeScript', NOW(), NOW()),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '11111111-1111-1111-1111-111111111111', 'C#', NOW(), NOW()),
  
  -- Options for Best Frontend Framework
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '22222222-2222-2222-2222-222222222222', 'React', NOW(), NOW()),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '22222222-2222-2222-2222-222222222222', 'Vue', NOW(), NOW()),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '22222222-2222-2222-2222-222222222222', 'Angular', NOW(), NOW()),
  ('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '22222222-2222-2222-2222-222222222222', 'Svelte', NOW(), NOW()),
  
  -- Options for Preferred Database
  ('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', '33333333-3333-3333-3333-333333333333', 'PostgreSQL', NOW(), NOW()),
  ('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', '33333333-3333-3333-3333-333333333333', 'MySQL', NOW(), NOW()),
  ('llllllll-llll-llll-llll-llllllllllll', '33333333-3333-3333-3333-333333333333', 'MongoDB', NOW(), NOW()),
  ('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', '33333333-3333-3333-3333-333333333333', 'SQLite', NOW(), NOW()),
  ('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', '33333333-3333-3333-3333-333333333333', 'Supabase', NOW(), NOW()),
  
  -- Options for Team Meeting Time
  ('oooooooo-oooo-oooo-oooo-oooooooooooo', '44444444-4444-4444-4444-444444444444', 'Monday 9:00 AM', NOW(), NOW()),
  ('pppppppp-pppp-pppp-pppp-pppppppppppp', '44444444-4444-4444-4444-444444444444', 'Tuesday 2:00 PM', NOW(), NOW()),
  ('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', '44444444-4444-4444-4444-444444444444', 'Wednesday 10:00 AM', NOW(), NOW()),
  ('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', '44444444-4444-4444-4444-444444444444', 'Thursday 3:00 PM', NOW(), NOW()),
  ('ssssssss-ssss-ssss-ssss-ssssssssssss', '44444444-4444-4444-4444-444444444444', 'Friday 11:00 AM', NOW(), NOW());

-- Insert sample votes
-- Note: In a real application, user_id would be the actual user IDs from auth.users
INSERT INTO votes (id, user_id, option_id, created_at)
VALUES
  -- Votes for Favorite Programming Language
  (gen_random_uuid(), auth.uid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', NOW()),
  (gen_random_uuid(), NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW()),
  (gen_random_uuid(), NULL, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', NOW()),
  (gen_random_uuid(), NULL, 'cccccccc-cccc-cccc-cccc-cccccccccccc', NOW()),
  (gen_random_uuid(), NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW()),
  (gen_random_uuid(), NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW()),
  (gen_random_uuid(), NULL, 'dddddddd-dddd-dddd-dddd-dddddddddddd', NOW()),
  
  -- Votes for Best Frontend Framework
  (gen_random_uuid(), auth.uid(), 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW()),
  (gen_random_uuid(), NULL, 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW()),
  (gen_random_uuid(), NULL, 'ffffffff-ffff-ffff-ffff-ffffffffffff', NOW()),
  (gen_random_uuid(), NULL, 'gggggggg-gggg-gggg-gggg-gggggggggggg', NOW()),
  (gen_random_uuid(), NULL, 'gggggggg-gggg-gggg-gggg-gggggggggggg', NOW()),
  (gen_random_uuid(), NULL, 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', NOW()),
  (gen_random_uuid(), NULL, 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', NOW()),
  
  -- Votes for Preferred Database
  (gen_random_uuid(), auth.uid(), 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', NOW()),
  (gen_random_uuid(), NULL, 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', NOW()),
  (gen_random_uuid(), NULL, 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', NOW()),
  (gen_random_uuid(), NULL, 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', NOW()),
  (gen_random_uuid(), NULL, 'llllllll-llll-llll-llll-llllllllllll', NOW()),
  (gen_random_uuid(), NULL, 'llllllll-llll-llll-llll-llllllllllll', NOW()),
  (gen_random_uuid(), NULL, 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', NOW()),
  (gen_random_uuid(), NULL, 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', NOW()),
  (gen_random_uuid(), NULL, 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', NOW()),
  
  -- Votes for Team Meeting Time (private poll)
  (gen_random_uuid(), auth.uid(), 'oooooooo-oooo-oooo-oooo-oooooooooooo', NOW()),
  (gen_random_uuid(), NULL, 'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', NOW()),
  (gen_random_uuid(), NULL, 'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', NOW()),
  (gen_random_uuid(), NULL, 'rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', NOW());