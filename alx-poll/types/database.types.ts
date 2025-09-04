export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          creator_id: string
          is_public: boolean
          allow_multiple_votes: boolean
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          creator_id: string
          is_public?: boolean
          allow_multiple_votes?: boolean
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          creator_id?: string
          is_public?: boolean
          allow_multiple_votes?: boolean
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          option_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_text: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          user_id: string | null
          option_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          option_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          option_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_poll_results: {
        Args: {
          poll_uuid: string
        }
        Returns: {
          option_id: string
          option_text: string
          vote_count: number
        }[]
      }
      has_user_voted_on_poll: {
        Args: {
          poll_uuid: string
          user_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}