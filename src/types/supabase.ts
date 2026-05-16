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
      comparisons: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["comparisons"]["Insert"]>;
      };
      suppliers: {
        Row: {
          id: string;
          comparison_id: string;
          name: string;
          file_path: string | null;
          quote_number: string | null;
          quote_date: string | null;
          currency: string | null;
          payment_terms: string | null;
          overall_lead_time: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          comparison_id: string;
          name: string;
          file_path?: string | null;
          quote_number?: string | null;
          quote_date?: string | null;
          currency?: string | null;
          payment_terms?: string | null;
          overall_lead_time?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["suppliers"]["Insert"]>;
      };
      line_items: {
        Row: {
          id: string;
          supplier_id: string;
          item_name: string;
          normalized_item_name: string;
          description: string | null;
          quantity: number | null;
          unit_price: number | null;
          total_price: number | null;
          unit_of_measure: string | null;
          lead_time: string | null;
          minimum_order_quantity: number | null;
          notes: string | null;
          confidence_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          item_name: string;
          normalized_item_name: string;
          description?: string | null;
          quantity?: number | null;
          unit_price?: number | null;
          total_price?: number | null;
          unit_of_measure?: string | null;
          lead_time?: string | null;
          minimum_order_quantity?: number | null;
          notes?: string | null;
          confidence_score?: number | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["line_items"]["Insert"]>;
      };
      comparison_results: {
        Row: {
          id: string;
          comparison_id: string;
          result_json: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          comparison_id: string;
          result_json: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["comparison_results"]["Insert"]>;
      };
      user_profiles: {
        Row: {
          id: string;
          email: string | null;
          subscription_status: string;
          stripe_customer_id: string | null;
          comparisons_used: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          subscription_status?: string;
          stripe_customer_id?: string | null;
          comparisons_used?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_profiles"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
