'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

// Create a Supabase client for server actions
const createServerActionClient = () => {
  const cookieStore = cookies();
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
};

type CreatePollFormData = {
  title: string;
  description?: string;
  options: string[];
  isPublic: boolean;
  allowMultipleVotes: boolean;
  expiresAt?: Date;
};

/**
 * Create a new poll with options
 */
export async function createPoll(formData: FormData) {
  const supabase = createServerActionClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login?message=You must be logged in to create a poll');
  }
  
  // Extract form data
  const title = formData.get('title') as string;
  const description = formData.get('description') as string || null;
  
  // Get all options (they might be named option-0, option-1, etc.)
  const options: string[] = [];
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('option-') && value) {
      options.push(value as string);
    }
  }
  
  // Filter out empty options
  const validOptions = options.filter(option => option.trim() !== '');
  
  // Validate input
  if (!title || title.trim() === '') {
    throw new Error('Poll title is required');
  }
  
  if (validOptions.length < 2) {
    throw new Error('At least two poll options are required');
  }
  
  const isPublic = formData.get('isPublic') === 'true';
  const allowMultipleVotes = formData.get('allowMultipleVotes') === 'true';
  
  // Handle expiration date if provided
  let expiresAt = null;
  const expirationDate = formData.get('expiresAt') as string;
  if (expirationDate && expirationDate.trim() !== '') {
    expiresAt = new Date(expirationDate).toISOString();
  }
  
  try {
    // Insert the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title,
        description,
        creator_id: session.user.id,
        is_public: isPublic,
        allow_multiple_votes: allowMultipleVotes,
        expires_at: expiresAt,
      })
      .select()
      .single();
    
    if (pollError) throw pollError;
    
    // Insert options
    const optionsToInsert = validOptions.map(option => ({
      poll_id: poll.id,
      option_text: option,
    }));
    
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert);
    
    if (optionsError) throw optionsError;
    
    // Revalidate the polls page and redirect
    revalidatePath('/polls');
    redirect(`/polls/${poll.id}`);
  } catch (error) {
    console.error('Error creating poll:', error);
    throw new Error('Failed to create poll. Please try again.');
  }
}

/**
 * Vote on a poll option
 */
export async function voteOnPoll(formData: FormData) {
  const supabase = createServerActionClient();
  
  // Get the option ID and poll ID from the form data
  const optionId = formData.get('optionId') as string;
  const pollId = formData.get('pollId') as string;
  
  if (!optionId || !pollId) {
    throw new Error('Option ID and Poll ID are required');
  }
  
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    // Check if the poll allows anonymous votes
    const { data: poll } = await supabase
      .from('polls')
      .select('allow_multiple_votes')
      .eq('id', pollId)
      .single();
    
    // If user is authenticated, check if they've already voted (unless multiple votes are allowed)
    if (session && !poll?.allow_multiple_votes) {
      const { data: hasVoted } = await supabase
        .rpc('has_user_voted_on_poll', {
          poll_uuid: pollId,
          user_uuid: session.user.id,
        });
      
      if (hasVoted) {
        throw new Error('You have already voted on this poll');
      }
    }
    
    // Insert the vote
    const { error } = await supabase
      .from('votes')
      .insert({
        option_id: optionId,
        user_id: session?.user.id || null,
      });
    
    if (error) throw error;
    
    // Revalidate the poll page
    revalidatePath(`/polls/${pollId}`);
    redirect(`/polls/${pollId}/results`);
  } catch (error: any) {
    console.error('Error voting on poll:', error);
    throw new Error(error.message || 'Failed to vote. Please try again.');
  }
}

/**
 * Delete a poll
 */
export async function deletePoll(formData: FormData) {
  const supabase = createServerActionClient();
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login?message=You must be logged in to delete a poll');
  }
  
  const pollId = formData.get('pollId') as string;
  
  if (!pollId) {
    throw new Error('Poll ID is required');
  }
  
  try {
    // Check if the user is the creator of the poll
    const { data: poll } = await supabase
      .from('polls')
      .select('creator_id')
      .eq('id', pollId)
      .single();
    
    if (!poll || poll.creator_id !== session.user.id) {
      throw new Error('You do not have permission to delete this poll');
    }
    
    // Delete the poll (cascade will handle options and votes)
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId);
    
    if (error) throw error;
    
    // Revalidate the polls page and redirect
    revalidatePath('/polls/my');
    redirect('/polls/my');
  } catch (error: any) {
    console.error('Error deleting poll:', error);
    throw new Error(error.message || 'Failed to delete poll. Please try again.');
  }
}