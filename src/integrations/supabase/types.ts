export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          last_login: string | null
          password_hash: string
          role: string
          username: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          last_login?: string | null
          password_hash: string
          role?: string
          username: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          last_login?: string | null
          password_hash?: string
          role?: string
          username?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          available_quantity: number
          category: string | null
          created_at: string
          deposit_amount: number | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          rental_duration_days: number | null
          status: string | null
          total_quantity: number
          updated_at: string
        }
        Insert: {
          available_quantity?: number
          category?: string | null
          created_at?: string
          deposit_amount?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          rental_duration_days?: number | null
          status?: string | null
          total_quantity?: number
          updated_at?: string
        }
        Update: {
          available_quantity?: number
          category?: string | null
          created_at?: string
          deposit_amount?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          rental_duration_days?: number | null
          status?: string | null
          total_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          contact_number: string | null
          created_at: string
          email: string | null
          feedback: string
          id: string
          is_read: boolean
          name: string
          rating: number
          suggestion: string | null
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          email?: string | null
          feedback: string
          id?: string
          is_read?: boolean
          name: string
          rating: number
          suggestion?: string | null
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          email?: string | null
          feedback?: string
          id?: string
          is_read?: boolean
          name?: string
          rating?: number
          suggestion?: string | null
        }
        Relationships: []
      }
      mel_users: {
        Row: {
          created_at: string
          full_name: string
          id: string
          password_hash: string
          role: string
          username: string
          user_id: string | null
          email: string | null
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          password_hash: string
          role?: string
          username: string
          user_id?: string | null
          email?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          password_hash?: string
          role?: string
          username?: string
          user_id?: string | null
          email?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          content: string
          created_at: string
          date: string | null
          id: string
          summary: string | null
          title: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          date?: string | null
          id?: string
          summary?: string | null
          title: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          date?: string | null
          id?: string
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      patient_history: {
        Row: {
          actual_return_date: string | null
          created_at: string
          deposit_amount: number | null
          equipment_id: string | null
          equipment_name: string
          expected_return_date: string
          id: string
          mel_user_id: string | null
          notes: string | null
          patient_aadhar: string | null
          patient_address: string | null
          patient_mobile: string | null
          patient_name: string
          pickup_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          actual_return_date?: string | null
          created_at?: string
          deposit_amount?: number | null
          equipment_id?: string | null
          equipment_name: string
          expected_return_date: string
          id?: string
          mel_user_id?: string | null
          notes?: string | null
          patient_aadhar?: string | null
          patient_address?: string | null
          patient_mobile?: string | null
          patient_name: string
          pickup_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          actual_return_date?: string | null
          created_at?: string
          deposit_amount?: number | null
          equipment_id?: string | null
          equipment_name?: string
          expected_return_date?: string
          id?: string
          mel_user_id?: string | null
          notes?: string | null
          patient_aadhar?: string | null
          patient_address?: string | null
          patient_mobile?: string | null
          patient_name?: string
          pickup_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_history_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_history_mel_user_id_fkey"
            columns: ["mel_user_id"]
            isOneToOne: false
            referencedRelation: "mel_users"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_gallery: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image_path: string | null
          image_url: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          image_path?: string | null
          image_url: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image_path?: string | null
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      popup_events: {
        Row: {
          banner_image_url: string | null
          created_at: string
          date: string | null
          description: string | null
          enabled: boolean
          id: string
          location: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          location?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          enabled?: boolean
          id?: string
          location?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      president_secretary: {
        Row: {
          bio: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          is_current: boolean | null
          name: string
          photo_url: string | null
          position: string
          role: string | null
          tenure_end: string | null
          tenure_start: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_current?: boolean | null
          name: string
          photo_url?: string | null
          position: string
          role?: string | null
          tenure_end?: string | null
          tenure_start?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          is_current?: boolean | null
          name?: string
          photo_url?: string | null
          position?: string
          role?: string | null
          tenure_end?: string | null
          tenure_start?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          details: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          details: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          details?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          title: string
          year: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          title: string
          year: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          title?: string
          year?: string
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_news: boolean | null
          thumbnail_url: string | null
          title: string
          video_id: string
          is_news: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_news?: boolean | null
          thumbnail_url?: string | null
          title: string
          video_id: string
          is_news?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_news?: boolean | null
          thumbnail_url?: string | null
          title?: string
          video_id?: string
          is_news?: boolean
        }
        Relationships: []
      }
      equipment_inventory: {
        Row: {
          id: string
          name: string
          photo_url: string | null
          total_quantity: number
          available_quantity: number
          rental_duration: number
          deposit_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          photo_url?: string | null
          total_quantity: number
          available_quantity: number
          rental_duration: number
          deposit_amount: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          photo_url?: string | null
          total_quantity?: number
          available_quantity?: number
          rental_duration?: number
          deposit_amount?: number
          created_at?: string
        }
        Relationships: []
      }
      patient_history: {
        Row: {
          id: string
          equipment_id: string | null
          mel_user_id: string | null
          patient_name: string
          patient_address: string | null
          patient_mobile: string | null
          patient_aadhar: string | null
          equipment_name: string
          deposit_amount: number
          pickup_date: string
          expected_return_date: string
          actual_return_date: string | null
          status: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          equipment_id?: string | null
          mel_user_id?: string | null
          patient_name: string
          patient_address?: string | null
          patient_mobile?: string | null
          patient_aadhar?: string | null
          equipment_name: string
          deposit_amount?: number
          pickup_date: string
          expected_return_date: string
          actual_return_date?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string | null
          mel_user_id?: string | null
          patient_name?: string
          patient_address?: string | null
          patient_mobile?: string | null
          patient_aadhar?: string | null
          equipment_name?: string
          deposit_amount?: number
          pickup_date?: string
          expected_return_date?: string
          actual_return_date?: string | null
          status?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      president_secretary: {
        Row: {
          id: string
          position: string
          name: string
          photo_url: string | null
          bio: string | null
          contact_email: string | null
          contact_phone: string | null
          tenure_start: string | null
          tenure_end: string | null
          is_current: boolean
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          position: string
          name: string
          photo_url?: string | null
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          tenure_start?: string | null
          tenure_end?: string | null
          is_current?: boolean
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          position?: string
          name?: string
          photo_url?: string | null
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          tenure_start?: string | null
          tenure_end?: string | null
          is_current?: boolean
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admins: {
        Row: {
          id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_mel_user_safe_info: {
        Args: { user_id?: string }
        Returns: {
          created_at: string
          full_name: string
          id: string
          role: string
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
