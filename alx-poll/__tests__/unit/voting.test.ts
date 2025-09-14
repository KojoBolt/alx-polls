import { voteOnPoll, hasUserVotedOnPoll, getPollResults } from '@/lib/polls';
import { supabase } from '@/lib/supabase';

// Mock the supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn(),
    },
    rpc: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Voting Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('voteOnPoll', () => {
    it('should record a vote successfully', async () => {
      const mockVote = {
        id: 'vote-123',
        user_id: 'user-123',
        option_id: 'option-123',
        created_at: '2023-01-01T00:00:00Z',
      };

      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockVote, error: null }),
      };

      mockSupabase.from.mockReturnValueOnce(mockQuery as any);

      const result = await voteOnPoll('option-123');

      expect(result).toEqual(mockVote);
      expect(mockQuery.insert).toHaveBeenCalledWith({
        option_id: 'option-123',
      });
    });

    it('should throw error when voting fails', async () => {
      const mockError = new Error('Vote recording failed');
      
      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabase.from.mockReturnValueOnce(mockQuery as any);

      await expect(voteOnPoll('option-123')).rejects.toThrow('Vote recording failed');
    });

    it('should handle voting with invalid option ID', async () => {
      const mockError = new Error('Invalid option ID');
      
      const mockQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabase.from.mockReturnValueOnce(mockQuery as any);

      await expect(voteOnPoll('invalid-option')).rejects.toThrow('Invalid option ID');
    });
  });

  describe('hasUserVotedOnPoll', () => {
    it('should return true when user has voted on poll', async () => {
      const mockSession = {
        session: {
          user: { id: 'user-123' },
        },
      };

      mockSupabase.auth.getSession.mockResolvedValue(mockSession as any);
      mockSupabase.rpc.mockResolvedValue({ data: true, error: null });

      const result = await hasUserVotedOnPoll('poll-123');

      expect(result).toBe(true);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('has_user_voted_on_poll', {
        poll_uuid: 'poll-123',
        user_uuid: 'user-123',
      });
    });

    it('should return false when user has not voted on poll', async () => {
      const mockSession = {
        session: {
          user: { id: 'user-123' },
        },
      };

      mockSupabase.auth.getSession.mockResolvedValue(mockSession as any);
      mockSupabase.rpc.mockResolvedValue({ data: false, error: null });

      const result = await hasUserVotedOnPoll('poll-123');

      expect(result).toBe(false);
    });

    it('should return false when user is not authenticated', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });

      const result = await hasUserVotedOnPoll('poll-123');

      expect(result).toBe(false);
      expect(mockSupabase.rpc).not.toHaveBeenCalled();
    });

    it('should throw error when RPC call fails', async () => {
      const mockSession = {
        session: {
          user: { id: 'user-123' },
        },
      };

      const mockError = new Error('RPC call failed');

      mockSupabase.auth.getSession.mockResolvedValue(mockSession as any);
      mockSupabase.rpc.mockResolvedValue({ data: null, error: mockError });

      await expect(hasUserVotedOnPoll('poll-123')).rejects.toThrow('RPC call failed');
    });
  });

  describe('getPollResults', () => {
    it('should return poll results successfully', async () => {
      const mockResults = [
        { option_id: 'opt-1', option_text: 'Option 1', vote_count: 5 },
        { option_id: 'opt-2', option_text: 'Option 2', vote_count: 3 },
        { option_id: 'opt-3', option_text: 'Option 3', vote_count: 2 },
      ];

      mockSupabase.rpc.mockResolvedValue({ data: mockResults, error: null });

      const result = await getPollResults('poll-123');

      expect(result).toEqual(mockResults);
      expect(mockSupabase.rpc).toHaveBeenCalledWith('get_poll_results', {
        poll_uuid: 'poll-123',
      });
    });

    it('should return empty results for poll with no votes', async () => {
      const mockResults: any[] = [];

      mockSupabase.rpc.mockResolvedValue({ data: mockResults, error: null });

      const result = await getPollResults('poll-123');

      expect(result).toEqual([]);
    });

    it('should throw error when results fetch fails', async () => {
      const mockError = new Error('Results fetch failed');

      mockSupabase.rpc.mockResolvedValue({ data: null, error: mockError });

      await expect(getPollResults('poll-123')).rejects.toThrow('Results fetch failed');
    });

    it('should handle non-existent poll gracefully', async () => {
      const mockError = new Error('Poll not found');

      mockSupabase.rpc.mockResolvedValue({ data: null, error: mockError });

      await expect(getPollResults('non-existent-poll')).rejects.toThrow('Poll not found');
    });
  });
});
