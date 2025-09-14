import { createPoll, voteOnPoll, deletePoll } from '@/app/actions/poll-actions';
import { createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Mock Next.js modules
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('@supabase/ssr', () => ({
  createClient: jest.fn(),
}));

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('Poll Actions Integration Tests', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Supabase client
    mockSupabase = {
      auth: {
        getSession: jest.fn(),
      },
      from: jest.fn(),
      rpc: jest.fn(),
    };

    mockCreateClient.mockReturnValue(mockSupabase);
    mockCookies.mockReturnValue({
      get: jest.fn(),
      set: jest.fn(),
    } as any);
  });

  describe('createPoll', () => {
    it('should create a poll successfully with valid form data', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      const mockPoll = {
        id: 'poll-123',
        title: 'Test Poll',
        description: 'Test Description',
        creator_id: 'user-123',
        is_public: true,
        allow_multiple_votes: false,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        expires_at: null,
      };

      const formData = new FormData();
      formData.append('title', 'Test Poll');
      formData.append('description', 'Test Description');
      formData.append('option-0', 'Option 1');
      formData.append('option-1', 'Option 2');
      formData.append('isPublic', 'true');
      formData.append('allowMultipleVotes', 'false');

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const mockPollsQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
      };

      const mockOptionsQuery = {
        insert: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockPollsQuery)
        .mockReturnValueOnce(mockOptionsQuery);

      await createPoll(formData);

      expect(mockPollsQuery.insert).toHaveBeenCalledWith({
        title: 'Test Poll',
        description: 'Test Description',
        creator_id: 'user-123',
        is_public: true,
        allow_multiple_votes: false,
        expires_at: null,
      });

      expect(mockOptionsQuery.insert).toHaveBeenCalledWith([
        { poll_id: 'poll-123', option_text: 'Option 1' },
        { poll_id: 'poll-123', option_text: 'Option 2' },
      ]);

      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls');
      expect(mockRedirect).toHaveBeenCalledWith('/polls/poll-123');
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

      const formData = new FormData();
      formData.append('title', 'Test Poll');
      formData.append('option-0', 'Option 1');
      formData.append('option-1', 'Option 2');

      await createPoll(formData);

      expect(mockRedirect).toHaveBeenCalledWith('/login?message=You must be logged in to create a poll');
    });

    it('should throw error when poll title is empty', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const formData = new FormData();
      formData.append('title', '');
      formData.append('option-0', 'Option 1');
      formData.append('option-1', 'Option 2');

      await expect(createPoll(formData)).rejects.toThrow('Poll title is required');
    });

    it('should throw error when less than 2 options provided', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const formData = new FormData();
      formData.append('title', 'Test Poll');
      formData.append('option-0', 'Option 1');

      await expect(createPoll(formData)).rejects.toThrow('At least two poll options are required');
    });

    it('should handle poll creation failure gracefully', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const formData = new FormData();
      formData.append('title', 'Test Poll');
      formData.append('option-0', 'Option 1');
      formData.append('option-1', 'Option 2');

      const mockPollsQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Database error') }),
      };

      mockSupabase.from.mockReturnValueOnce(mockPollsQuery);

      await expect(createPoll(formData)).rejects.toThrow('Failed to create poll. Please try again.');
    });
  });

  describe('voteOnPoll', () => {
    it('should record a vote successfully for authenticated user', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      const formData = new FormData();
      formData.append('optionId', 'option-123');
      formData.append('pollId', 'poll-123');

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const mockPollQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { allow_multiple_votes: false }, error: null }),
      };

      const mockVoteQuery = {
        insert: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockPollQuery)
        .mockReturnValueOnce(mockVoteQuery);

      mockSupabase.rpc.mockResolvedValue({ data: false, error: null }); // User hasn't voted

      await voteOnPoll(formData);

      expect(mockVoteQuery.insert).toHaveBeenCalledWith({
        option_id: 'option-123',
        user_id: 'user-123',
      });

      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls/poll-123');
      expect(mockRedirect).toHaveBeenCalledWith('/polls/poll-123/results');
    });

    it('should prevent duplicate voting when multiple votes not allowed', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      const formData = new FormData();
      formData.append('optionId', 'option-123');
      formData.append('pollId', 'poll-123');

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const mockPollQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { allow_multiple_votes: false }, error: null }),
      };

      mockSupabase.from.mockReturnValueOnce(mockPollQuery);
      mockSupabase.rpc.mockResolvedValue({ data: true, error: null }); // User has already voted

      await expect(voteOnPoll(formData)).rejects.toThrow('You have already voted on this poll');
    });

    it('should allow multiple votes when poll allows it', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      const formData = new FormData();
      formData.append('optionId', 'option-123');
      formData.append('pollId', 'poll-123');

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const mockPollQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { allow_multiple_votes: true }, error: null }),
      };

      const mockVoteQuery = {
        insert: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockPollQuery)
        .mockReturnValueOnce(mockVoteQuery);

      await voteOnPoll(formData);

      expect(mockVoteQuery.insert).toHaveBeenCalledWith({
        option_id: 'option-123',
        user_id: 'user-123',
      });
    });

    it('should throw error when option ID or poll ID is missing', async () => {
      const formData = new FormData();
      formData.append('optionId', 'option-123');
      // Missing pollId

      await expect(voteOnPoll(formData)).rejects.toThrow('Option ID and Poll ID are required');
    });
  });

  describe('deletePoll', () => {
    it('should delete a poll successfully when user is the creator', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      const formData = new FormData();
      formData.append('pollId', 'poll-123');

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const mockPollQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { creator_id: 'user-123' }, error: null }),
      };

      const mockDeleteQuery = {
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockPollQuery)
        .mockReturnValueOnce(mockDeleteQuery);

      await deletePoll(formData);

      expect(mockDeleteQuery.eq).toHaveBeenCalledWith('id', 'poll-123');
      expect(mockRevalidatePath).toHaveBeenCalledWith('/polls/my');
      expect(mockRedirect).toHaveBeenCalledWith('/polls/my');
    });

    it('should prevent deletion when user is not the creator', async () => {
      const mockSession = {
        user: { id: 'user-123' },
      };

      const formData = new FormData();
      formData.append('pollId', 'poll-123');

      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession }, error: null });

      const mockPollQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: { creator_id: 'different-user' }, error: null }),
      };

      mockSupabase.from.mockReturnValueOnce(mockPollQuery);

      await expect(deletePoll(formData)).rejects.toThrow('You do not have permission to delete this poll');
    });

    it('should redirect to login when user is not authenticated', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

      const formData = new FormData();
      formData.append('pollId', 'poll-123');

      await deletePoll(formData);

      expect(mockRedirect).toHaveBeenCalledWith('/login?message=You must be logged in to delete a poll');
    });
  });
});
