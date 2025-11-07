export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      challenges: {
        Row: {
          id: string;
          creator_id: string;
          title: string;
          description: string | null;
          stake_amount: number;
          frequency: 'daily' | 'weekly' | 'custom';
          required_proofs: number;
          start_date: string;
          end_date: string;
          status: 'pending' | 'active' | 'completed' | 'failed' | 'cancelled';
          payment_status: 'pending' | 'paid' | 'refunded' | 'distributed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id: string;
          title: string;
          description?: string | null;
          stake_amount: number;
          frequency: 'daily' | 'weekly' | 'custom';
          required_proofs: number;
          start_date: string;
          end_date: string;
          status?: 'pending' | 'active' | 'completed' | 'failed' | 'cancelled';
          payment_status?: 'pending' | 'paid' | 'refunded' | 'distributed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_id?: string;
          title?: string;
          description?: string | null;
          stake_amount?: number;
          frequency?: 'daily' | 'weekly' | 'custom';
          required_proofs?: number;
          start_date?: string;
          end_date?: string;
          status?: 'pending' | 'active' | 'completed' | 'failed' | 'cancelled';
          payment_status?: 'pending' | 'paid' | 'refunded' | 'distributed';
          created_at?: string;
          updated_at?: string;
        };
      };
      squad_members: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string | null;
          email: string | null;
          status: 'pending' | 'accepted' | 'declined';
          invited_at: string;
          responded_at: string | null;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id?: string | null;
          email?: string | null;
          status?: 'pending' | 'accepted' | 'declined';
          invited_at?: string;
          responded_at?: string | null;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string | null;
          email?: string | null;
          status?: 'pending' | 'accepted' | 'declined';
          invited_at?: string;
          responded_at?: string | null;
        };
      };
      proofs: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          caption: string | null;
          proof_date: string;
          status: 'pending' | 'approved' | 'disputed' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          media_url: string;
          media_type: 'image' | 'video';
          caption?: string | null;
          proof_date: string;
          status?: 'pending' | 'approved' | 'disputed' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          media_url?: string;
          media_type?: 'image' | 'video';
          caption?: string | null;
          proof_date?: string;
          status?: 'pending' | 'approved' | 'disputed' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      disputes: {
        Row: {
          id: string;
          proof_id: string;
          disputer_id: string;
          reason: string;
          status: 'open' | 'resolved' | 'dismissed';
          resolution: string | null;
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          proof_id: string;
          disputer_id: string;
          reason: string;
          status?: 'open' | 'resolved' | 'dismissed';
          resolution?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          proof_id?: string;
          disputer_id?: string;
          reason?: string;
          status?: 'open' | 'resolved' | 'dismissed';
          resolution?: string | null;
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          challenge_id: string;
          user_id: string;
          amount: number;
          type: 'stake' | 'refund' | 'payout';
          status: 'pending' | 'completed' | 'failed';
          polar_transaction_id: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          challenge_id: string;
          user_id: string;
          amount: number;
          type: 'stake' | 'refund' | 'payout';
          status?: 'pending' | 'completed' | 'failed';
          polar_transaction_id?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          challenge_id?: string;
          user_id?: string;
          amount?: number;
          type?: 'stake' | 'refund' | 'payout';
          status?: 'pending' | 'completed' | 'failed';
          polar_transaction_id?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          link?: string | null;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
