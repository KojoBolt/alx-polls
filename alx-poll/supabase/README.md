# Supabase Database Schema for ALX Poll App

## Overview

This directory contains the database schema for the ALX Poll application. The schema defines the following tables:

1. `polls` - Stores information about polls created by users
2. `poll_options` - Stores the options for each poll
3. `votes` - Tracks votes cast by users

## Schema Structure

### Polls Table

- `id`: UUID (Primary Key)
- `title`: Text (Required)
- `description`: Text (Optional)
- `creator_id`: UUID (Foreign Key to auth.users)
- `is_public`: Boolean (Default: true)
- `allow_multiple_votes`: Boolean (Default: false)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `expires_at`: Timestamp (Optional)

### Poll Options Table

- `id`: UUID (Primary Key)
- `poll_id`: UUID (Foreign Key to polls)
- `option_text`: Text (Required)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Votes Table

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users, nullable)
- `option_id`: UUID (Foreign Key to poll_options)
- `created_at`: Timestamp
- Unique constraint on (user_id, option_id) to prevent duplicate votes

## Row Level Security (RLS) Policies

The schema includes RLS policies to secure data access:

### Polls Table Policies

- Public polls are viewable by everyone
- Users can view, update, and delete their own polls
- Only authenticated users can create polls

### Poll Options Table Policies

- Anyone can view options for public polls
- Users can view, update, and delete options for their own polls
- Only poll creators can add options to polls

### Votes Table Policies

- Anyone can view votes for public polls
- Poll creators can view all votes on their polls
- Authenticated users can vote on public polls
- Users can delete their own votes

## Helper Functions

1. `has_user_voted_on_poll(poll_uuid UUID, user_uuid UUID)` - Checks if a user has already voted on a specific poll
2. `get_poll_results(poll_uuid UUID)` - Returns the results of a poll with vote counts for each option

## Setup Instructions

### Local Development

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Start Supabase locally:
   ```bash
   supabase start
   ```

3. Apply migrations:
   ```bash
   supabase db reset
   ```

### Production Deployment

1. Link your project (if not already linked):
   ```bash
   supabase link --project-ref your-project-ref
   ```

2. Push the migrations to your Supabase project:
   ```bash
   supabase db push
   ```

## Using the Schema in Your Application

The TypeScript types for this schema are defined in `types/database.types.ts`. Import these types when working with the Supabase client to ensure type safety.

Example usage:

```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Now you have type safety when querying the database
const { data: polls } = await supabase
  .from('polls')
  .select('*')
```