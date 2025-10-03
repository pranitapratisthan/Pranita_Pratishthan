export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
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
          title: string
          video_id: string
          is_news: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          title: string
          video_id: string
          is_news?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
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
          equipment_id: string
          equipment_name: string
          patient_name: string
          mobile_number: string
          pickup_date: string
          return_date: string
          status: string
          created_by_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          equipment_name: string
          patient_name: string
          mobile_number: string
          pickup_date: string
          return_date: string
          status: string
          created_by_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          equipment_name?: string
          patient_name?: string
          mobile_number?: string
          pickup_date?: string
          return_date?: string
          status?: string
          created_by_user_id?: string
          created_at?: string
        }
        Relationships: []
      }
      president_secretary: {
        Row: {
          id: string
          name: string
          role: string
          message: string | null
          photo_url: string | null
          photo_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          message?: string | null
          photo_url?: string | null
          photo_path?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          message?: string | null
          photo_url?: string | null
          photo_path?: string | null
          created_at?: string
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
      [_ in never]: never
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
