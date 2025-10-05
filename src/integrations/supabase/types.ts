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
          email: string
          full_name: string
          id: string
          role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      equipment_inventory: {
        Row: {
          available_quantity: number
          created_at: string
          deposit_amount: number
          id: string
          name: string
          photo_path: string | null
          photo_url: string | null
          rental_duration: number
          total_quantity: number
          updated_at: string
        }
        Insert: {
          available_quantity?: number
          created_at?: string
          deposit_amount?: number
          id?: string
          name: string
          photo_path?: string | null
          photo_url?: string | null
          rental_duration?: number
          total_quantity?: number
          updated_at?: string
        }
        Update: {
          available_quantity?: number
          created_at?: string
          deposit_amount?: number
          id?: string
          name?: string
          photo_path?: string | null
          photo_url?: string | null
          rental_duration?: number
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
          is_read: boolean | null
          name: string
          rating: number | null
          suggestion: string | null
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          email?: string | null
          feedback: string
          id?: string
          is_read?: boolean | null
          name: string
          rating?: number | null
          suggestion?: string | null
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          email?: string | null
          feedback?: string
          id?: string
          is_read?: boolean | null
          name?: string
          rating?: number | null
          suggestion?: string | null
        }
        Relationships: []
      }
      mel_users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
          user_id: string | null
          username: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          updated_at?: string
          user_id?: string | null
          username: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
          user_id?: string | null
          username?: string
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
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          date?: string | null
          id?: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          date?: string | null
          id?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      patient_history: {
        Row: {
          created_at: string
          created_by_user_id: string | null
          equipment_id: string | null
          equipment_name: string
          id: string
          mobile_number: string
          patient_name: string
          pickup_date: string
          return_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by_user_id?: string | null
          equipment_id?: string | null
          equipment_name: string
          id?: string
          mobile_number: string
          patient_name: string
          pickup_date: string
          return_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by_user_id?: string | null
          equipment_id?: string | null
          equipment_name?: string
          id?: string
          mobile_number?: string
          patient_name?: string
          pickup_date?: string
          return_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_history_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment_inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      photo_gallery: {
        Row: {
          category: string | null
          created_at: string
          id: string
          image_path: string
          image_url: string
          project_id: string | null
          title: string
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          image_path: string
          image_url: string
          project_id?: string | null
          title: string
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          image_path?: string
          image_url?: string
          project_id?: string | null
          title?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_photo_gallery_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      popup_events: {
        Row: {
          banner_image_path: string | null
          banner_image_url: string | null
          created_at: string
          date: string | null
          description: string | null
          enabled: boolean | null
          id: string
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          banner_image_path?: string | null
          banner_image_url?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          banner_image_path?: string | null
          banner_image_url?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          enabled?: boolean | null
          id?: string
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      president_secretary: {
        Row: {
          id: string
          message: string | null
          name: string
          photo_path: string | null
          photo_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          id?: string
          message?: string | null
          name: string
          photo_path?: string | null
          photo_url?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          id?: string
          message?: string | null
          name?: string
          photo_path?: string | null
          photo_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          details: string | null
          id: string
          image_path: string | null
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          details?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          details?: string | null
          id?: string
          image_path?: string | null
          image_url?: string | null
          name?: string
          updated_at?: string
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
          is_news: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_news?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_news?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
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
