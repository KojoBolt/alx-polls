import { createPoll, getPollById, voteOnPoll, hasUserVotedOnPoll, getPollResults, deletePoll } from '@/lib/polls';
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

describe('Poll Creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPoll', () => {
    // REFINED TEST: Enhanced with stronger assertions, better mocking, and clearer test structure
    // What was refined: Added comprehensive validation of poll data structure, improved mock setup
    // with proper chaining verification, added edge case validation for option mapping,
    // and enhanced error handling verification. This test now provides better coverage
    // of the poll creation workflow and ensures data integrity.
    it('should create a poll with valid data and properly map options', async () => {
      // Arrange: Set up comprehensive mock data with realistic timestamps
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

      const testOptions = ['Option 1', 'Option 2', 'Option 3'];
      const expectedOptionsMapping = testOptions.map(option => ({
        poll_id: mockPoll.id,
        option_text: option,
      }));

      // Mock the polls table insert with proper method chaining verification
      const mockPollsQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
      };

      // Mock the poll_options table insert
      const mockOptionsQuery = {
        insert: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockPollsQuery as any)
        .mockReturnValueOnce(mockOptionsQuery as any);

      // Act: Execute the poll creation
      const result = await createPoll(
        'Test Poll',
        'Test Description',
        testOptions,
        true,
        false,
        null
      );

      // Assert: Comprehensive validation of poll creation workflow
      expect(result).toEqual(mockPoll);
      expect(result.id).toBeDefined();
      expect(result.title).toBe('Test Poll');
      expect(result.description).toBe('Test Description');
      expect(result.is_public).toBe(true);
      expect(result.allow_multiple_votes).toBe(false);
      expect(result.expires_at).toBeNull();

      // Verify method chaining was called in correct order
      expect(mockPollsQuery.insert).toHaveBeenCalledWith({
        title: 'Test Poll',
        description: 'Test Description',
        is_public: true,
        allow_multiple_votes: false,
        expires_at: null,
      });
      expect(mockPollsQuery.select).toHaveBeenCalledAfter(mockPollsQuery.insert as jest.Mock);
      expect(mockPollsQuery.single).toHaveBeenCalledAfter(mockPollsQuery.select as jest.Mock);

      // Verify options were mapped correctly with proper poll_id reference
      expect(mockOptionsQuery.insert).toHaveBeenCalledWith(expectedOptionsMapping);
      expect(mockOptionsQuery.insert).toHaveBeenCalledTimes(1);

      // Verify Supabase from method was called for both tables
      expect(mockSupabase.from).toHaveBeenCalledTimes(2);
      expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'polls');
      expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'poll_options');
    });

    it('should handle poll creation with expiration date', async () => {
      const mockPoll = {
        id: 'poll-123',
        title: 'Test Poll',
        description: null,
        creator_id: 'user-123',
        is_public: true,
        allow_multiple_votes: false,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        expires_at: '2023-12-31T23:59:59Z',
      };

      const expirationDate = new Date('2023-12-31T23:59:59Z');

      const mockPollsQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
      };

      const mockOptionsQuery = {
        insert: jest.fn().mockResolvedValue({ error: null }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockPollsQuery as any)
        .mockReturnValueOnce(mockOptionsQuery as any);

      const result = await createPoll(
        'Test Poll',
        null,
        ['Option 1', 'Option 2'],
        true,
        false,
        expirationDate
      );

      expect(result).toEqual(mockPoll);
      expect(mockPollsQuery.insert).toHaveBeenCalledWith({
        title: 'Test Poll',
        description: null,
        is_public: true,
        allow_multiple_votes: false,
        expires_at: '2023-12-31T23:59:59.000Z',
      });
    });

    it('should throw error when poll creation fails', async () => {
      const mockError = new Error('Database connection failed');
      
      const mockPollsQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabase.from.mockReturnValueOnce(mockPollsQuery as any);

      await expect(createPoll(
        'Test Poll',
        'Test Description',
        ['Option 1', 'Option 2'],
        true,
        false,
        null
      )).rejects.toThrow('Database connection failed');
    });

    it('should throw error when options creation fails', async () => {
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

      const mockPollsQuery = {
        insert: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
      };

      const mockOptionsQuery = {
        insert: jest.fn().mockResolvedValue({ error: new Error('Options creation failed') }),
      };

      mockSupabase.from
        .mockReturnValueOnce(mockPollsQuery as any)
        .mockReturnValueOnce(mockOptionsQuery as any);

      await expect(createPoll(
        'Test Poll',
        'Test Description',
        ['Option 1', 'Option 2'],
        true,
        false,
        null
      )).rejects.toThrow('Options creation failed');
    });
  });

  describe('getPollById', () => {
    it('should fetch a poll by ID successfully', async () => {
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
        poll_options: [
          { id: 'opt-1', poll_id: 'poll-123', option_text: 'Option 1', created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
          { id: 'opt-2', poll_id: 'poll-123', option_text: 'Option 2', created_at: '2023-01-01T00:00:00Z', updated_at: '2023-01-01T00:00:00Z' },
        ],
      };

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockPoll, error: null }),
      };

      mockSupabase.from.mockReturnValueOnce(mockQuery as any);

      const result = await getPollById('poll-123');

      expect(result).toEqual(mockPoll);
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'poll-123');
    });

    it('should throw error when poll not found', async () => {
      const mockError = new Error('Poll not found');
      
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      mockSupabase.from.mockReturnValueOnce(mockQuery as any);

      await expect(getPollById('non-existent-poll')).rejects.toThrow('Poll not found');
    });
  });
});
