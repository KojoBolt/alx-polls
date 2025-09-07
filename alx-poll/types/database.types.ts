export type PollOption = {
  id: string;
  poll_id: string;
  option_text: string;
  created_at: string;
  updated_at: string;
};

export type Poll = {
  id: string;
  title: string;
  description: string | null;
  creator_id: string;
  is_public: boolean;
  allow_multiple_votes: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  options: PollOption[];
};