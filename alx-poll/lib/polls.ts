import { supabase } from './supabase';
import { Database } from '@/types/database.types';

type Poll = Database['public']['Tables']['polls']['Row'];
type PollOption = Database['public']['Tables']['poll_options']['Row'];
type Vote = Database['public']['Tables']['votes']['Row'];
type PollResult = Database['public']['Functions']['get_poll_results']['Returns'][0];

/**
 * Fetch all public polls
 */
export async function getPublicPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select('*, poll_options(*)')
    .eq('is_public', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public polls:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch a specific poll by ID
 */
export async function getPollById(id: string) {
  const { data, error } = await supabase
    .from('polls')
    .select('*, poll_options(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching poll with ID ${id}:`, error);
    throw error;
  }

  return data;
}

/**
 * Fetch polls created by the current user
 */
export async function getUserPolls() {
  const { data, error } = await supabase
    .from('polls')
    .select('*, poll_options(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user polls:', error);
    throw error;
  }

  return data;
}

/**
 * Create a new poll with options
 */
export async function createPoll(
  title: string,
  description: string | null,
  options: string[],
  isPublic: boolean = true,
  allowMultipleVotes: boolean = false,
  expiresAt: Date | null = null
) {
  // Start a transaction
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({
      title,
      description,
      is_public: isPublic,
      allow_multiple_votes: allowMultipleVotes,
      expires_at: expiresAt?.toISOString() || null,
    })
    .select()
    .single();

  if (pollError) {
    console.error('Error creating poll:', pollError);
    throw pollError;
  }

  // Insert options
  const optionsToInsert = options.map(option => ({
    poll_id: poll.id,
    option_text: option,
  }));

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsToInsert);

  if (optionsError) {
    console.error('Error creating poll options:', optionsError);
    // In a real app, you might want to delete the poll if options creation fails
    throw optionsError;
  }

  return poll;
}

/**
 * Vote on a poll option
 */
export async function voteOnPoll(optionId: string) {
  const { data, error } = await supabase
    .from('votes')
    .insert({
      option_id: optionId,
    })
    .select()
    .single();

  if (error) {
    console.error('Error voting on poll:', error);
    throw error;
  }

  return data;
}

/**
 * Check if the current user has voted on a poll
 */
export async function hasUserVotedOnPoll(pollId: string) {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return false;

  const { data, error } = await supabase
    .rpc('has_user_voted_on_poll', {
      poll_uuid: pollId,
      user_uuid: session.session.user.id,
    });

  if (error) {
    console.error('Error checking if user voted on poll:', error);
    throw error;
  }

  return data;
}

/**
 * Get poll results
 */
export async function getPollResults(pollId: string) {
  const { data, error } = await supabase
    .rpc('get_poll_results', {
      poll_uuid: pollId,
    });

  if (error) {
    console.error('Error getting poll results:', error);
    throw error;
  }

  return data;
}

/**
 * Delete a poll
 */
export async function deletePoll(pollId: string) {
  const { error } = await supabase
    .from('polls')
    .delete()
    .eq('id', pollId);

  if (error) {
    console.error('Error deleting poll:', error);
    throw error;
  }

  return true;
}