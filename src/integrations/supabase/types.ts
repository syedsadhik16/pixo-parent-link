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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      attendance_records: {
        Row: {
          attendance_date: string
          child_id: string
          class_type: string | null
          created_at: string
          id: string
          minutes_attended: number | null
          reason: string | null
          session_title: string | null
          status: string
        }
        Insert: {
          attendance_date: string
          child_id: string
          class_type?: string | null
          created_at?: string
          id?: string
          minutes_attended?: number | null
          reason?: string | null
          session_title?: string | null
          status: string
        }
        Update: {
          attendance_date?: string
          child_id?: string
          class_type?: string | null
          created_at?: string
          id?: string
          minutes_attended?: number | null
          reason?: string | null
          session_title?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_history: {
        Row: {
          amount: number
          child_id: string
          created_at: string
          currency: string | null
          id: string
          invoice_number: string | null
          invoice_url: string | null
          payment_date: string | null
          payment_provider: string | null
          payment_status: string | null
          subscription_id: string | null
        }
        Insert: {
          amount: number
          child_id: string
          created_at?: string
          currency?: string | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          payment_date?: string | null
          payment_provider?: string | null
          payment_status?: string | null
          subscription_id?: string | null
        }
        Update: {
          amount?: number
          child_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          payment_date?: string | null
          payment_provider?: string | null
          payment_status?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_history_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_history_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      child_schedule: {
        Row: {
          assigned_by: string | null
          child_id: string
          class_status: string
          created_at: string
          curriculum_day_id: string
          id: string
          scheduled_date: string
        }
        Insert: {
          assigned_by?: string | null
          child_id: string
          class_status?: string
          created_at?: string
          curriculum_day_id: string
          id?: string
          scheduled_date: string
        }
        Update: {
          assigned_by?: string | null
          child_id?: string
          class_status?: string
          created_at?: string
          curriculum_day_id?: string
          id?: string
          scheduled_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "child_schedule_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "child_schedule_curriculum_day_id_fkey"
            columns: ["curriculum_day_id"]
            isOneToOne: false
            referencedRelation: "curriculum_days"
            referencedColumns: ["id"]
          },
        ]
      }
      children: {
        Row: {
          age: number | null
          avatar_url: string | null
          child_code: string
          created_at: string
          current_day: number | null
          current_month: number | null
          current_week: number | null
          display_name: string
          id: string
          level: string | null
          profile_id: string | null
          school_name: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          child_code?: string
          created_at?: string
          current_day?: number | null
          current_month?: number | null
          current_week?: number | null
          display_name: string
          id?: string
          level?: string | null
          profile_id?: string | null
          school_name?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          child_code?: string
          created_at?: string
          current_day?: number | null
          current_month?: number | null
          current_week?: number | null
          display_name?: string
          id?: string
          level?: string | null
          profile_id?: string | null
          school_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "children_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_days: {
        Row: {
          class_title: string
          created_at: string
          day_number: number
          estimated_duration_minutes: number | null
          home_practice: string | null
          id: string
          lesson_parts: Json | null
          level: string
          month_number: number
          objective: string | null
          praise_line: string | null
          target_content: Json | null
          target_skills: Json | null
          week_number: number
        }
        Insert: {
          class_title: string
          created_at?: string
          day_number: number
          estimated_duration_minutes?: number | null
          home_practice?: string | null
          id?: string
          lesson_parts?: Json | null
          level: string
          month_number: number
          objective?: string | null
          praise_line?: string | null
          target_content?: Json | null
          target_skills?: Json | null
          week_number: number
        }
        Update: {
          class_title?: string
          created_at?: string
          day_number?: number
          estimated_duration_minutes?: number | null
          home_practice?: string | null
          id?: string
          lesson_parts?: Json | null
          level?: string
          month_number?: number
          objective?: string | null
          praise_line?: string | null
          target_content?: Json | null
          target_skills?: Json | null
          week_number?: number
        }
        Relationships: []
      }
      lesson_activity: {
        Row: {
          activity_date: string
          activity_type: string
          child_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          lesson_day: number | null
          metadata: Json | null
          score: number | null
          title: string
        }
        Insert: {
          activity_date: string
          activity_type: string
          child_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_day?: number | null
          metadata?: Json | null
          score?: number | null
          title: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          child_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_day?: number | null
          metadata?: Json | null
          score?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_activity_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_reports: {
        Row: {
          attendance_percentage: number | null
          child_id: string
          created_at: string
          id: string
          improvement_areas: Json | null
          lessons_completed: number | null
          month_label: string
          premium_insights: Json | null
          recommendations: Json | null
          strengths: Json | null
          summary: string | null
        }
        Insert: {
          attendance_percentage?: number | null
          child_id: string
          created_at?: string
          id?: string
          improvement_areas?: Json | null
          lessons_completed?: number | null
          month_label: string
          premium_insights?: Json | null
          recommendations?: Json | null
          strengths?: Json | null
          summary?: string | null
        }
        Update: {
          attendance_percentage?: number | null
          child_id?: string
          created_at?: string
          id?: string
          improvement_areas?: Json | null
          lessons_completed?: number | null
          month_label?: string
          premium_insights?: Json | null
          recommendations?: Json | null
          strengths?: Json | null
          summary?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_reports_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_child_links: {
        Row: {
          child_id: string
          id: string
          is_active: boolean | null
          linked_at: string | null
          parent_profile_id: string
          relation_label: string | null
        }
        Insert: {
          child_id: string
          id?: string
          is_active?: boolean | null
          linked_at?: string | null
          parent_profile_id: string
          relation_label?: string | null
        }
        Update: {
          child_id?: string
          id?: string
          is_active?: boolean | null
          linked_at?: string | null
          parent_profile_id?: string
          relation_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_child_links_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_child_links_parent_profile_id_fkey"
            columns: ["parent_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_notifications: {
        Row: {
          body: string | null
          category: string | null
          child_id: string | null
          created_at: string
          id: string
          notification_type: string | null
          parent_profile_id: string
          read: boolean | null
          title: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          child_id?: string | null
          created_at?: string
          id?: string
          notification_type?: string | null
          parent_profile_id: string
          read?: boolean | null
          title: string
        }
        Update: {
          body?: string | null
          category?: string | null
          child_id?: string | null
          created_at?: string
          id?: string
          notification_type?: string | null
          parent_profile_id?: string
          read?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_notifications_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_notifications_parent_profile_id_fkey"
            columns: ["parent_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_transactions: {
        Row: {
          amount: number
          child_id: string
          created_at: string
          currency: string | null
          id: string
          metadata: Json | null
          paid_at: string | null
          payment_method: string | null
          payment_status: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          subscription_id: string | null
        }
        Insert: {
          amount: number
          child_id: string
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          subscription_id?: string | null
        }
        Update: {
          amount?: number
          child_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          metadata?: Json | null
          paid_at?: string | null
          payment_method?: string | null
          payment_status?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_snapshots: {
        Row: {
          attendance_percentage: number | null
          child_id: string
          confidence_score: number | null
          created_at: string
          fluency_score: number | null
          id: string
          lessons_completed: number | null
          period_type: string
          phonics_score: number | null
          pronunciation_score: number | null
          reading_sessions: number | null
          snapshot_date: string
          speaking_attempts: number | null
          summary: string | null
          time_spent_minutes: number | null
          vocabulary_score: number | null
          weak_sounds: Json | null
          weak_words: Json | null
        }
        Insert: {
          attendance_percentage?: number | null
          child_id: string
          confidence_score?: number | null
          created_at?: string
          fluency_score?: number | null
          id?: string
          lessons_completed?: number | null
          period_type: string
          phonics_score?: number | null
          pronunciation_score?: number | null
          reading_sessions?: number | null
          snapshot_date: string
          speaking_attempts?: number | null
          summary?: string | null
          time_spent_minutes?: number | null
          vocabulary_score?: number | null
          weak_sounds?: Json | null
          weak_words?: Json | null
        }
        Update: {
          attendance_percentage?: number | null
          child_id?: string
          confidence_score?: number | null
          created_at?: string
          fluency_score?: number | null
          id?: string
          lessons_completed?: number | null
          period_type?: string
          phonics_score?: number | null
          pronunciation_score?: number | null
          reading_sessions?: number | null
          snapshot_date?: string
          speaking_attempts?: number | null
          summary?: string | null
          time_spent_minutes?: number | null
          vocabulary_score?: number | null
          weak_sounds?: Json | null
          weak_words?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_snapshots_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_language: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_language?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          child_id: string
          confidence_score: number | null
          current_day: number | null
          current_level: string | null
          current_month: number | null
          current_week: number | null
          fluency_score: number | null
          id: string
          phonics_score: number | null
          pronunciation_score: number | null
          streak_days: number | null
          strong_areas: Json | null
          total_lessons_completed: number | null
          total_minutes_spent: number | null
          total_reading_sessions: number | null
          total_speaking_attempts: number | null
          updated_at: string
          vocabulary_score: number | null
          weak_sounds: Json | null
          weak_words: Json | null
        }
        Insert: {
          child_id: string
          confidence_score?: number | null
          current_day?: number | null
          current_level?: string | null
          current_month?: number | null
          current_week?: number | null
          fluency_score?: number | null
          id?: string
          phonics_score?: number | null
          pronunciation_score?: number | null
          streak_days?: number | null
          strong_areas?: Json | null
          total_lessons_completed?: number | null
          total_minutes_spent?: number | null
          total_reading_sessions?: number | null
          total_speaking_attempts?: number | null
          updated_at?: string
          vocabulary_score?: number | null
          weak_sounds?: Json | null
          weak_words?: Json | null
        }
        Update: {
          child_id?: string
          confidence_score?: number | null
          current_day?: number | null
          current_level?: string | null
          current_month?: number | null
          current_week?: number | null
          fluency_score?: number | null
          id?: string
          phonics_score?: number | null
          pronunciation_score?: number | null
          streak_days?: number | null
          strong_areas?: Json | null
          total_lessons_completed?: number | null
          total_minutes_spent?: number | null
          total_reading_sessions?: number | null
          total_speaking_attempts?: number | null
          updated_at?: string
          vocabulary_score?: number | null
          weak_sounds?: Json | null
          weak_words?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: true
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_cycle_months: number | null
          child_id: string
          created_at: string
          expiry_date: string | null
          id: string
          is_premium: boolean | null
          level_access: Json | null
          payment_status: string | null
          plan_name: string
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          billing_cycle_months?: number | null
          child_id: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_premium?: boolean | null
          level_access?: Json | null
          payment_status?: string | null
          plan_name?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          billing_cycle_months?: number | null
          child_id?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          is_premium?: boolean | null
          level_access?: Json | null
          payment_status?: string | null
          plan_name?: string
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
      support_requests: {
        Row: {
          child_id: string | null
          created_at: string
          id: string
          issue_type: string | null
          message: string
          parent_profile_id: string
          status: string | null
          subject: string
        }
        Insert: {
          child_id?: string | null
          created_at?: string
          id?: string
          issue_type?: string | null
          message: string
          parent_profile_id: string
          status?: string | null
          subject: string
        }
        Update: {
          child_id?: string | null
          created_at?: string
          id?: string
          issue_type?: string | null
          message?: string
          parent_profile_id?: string
          status?: string | null
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_requests_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_requests_parent_profile_id_fkey"
            columns: ["parent_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_reports: {
        Row: {
          child_id: string
          confidence_note: string | null
          created_at: string
          id: string
          improvement_areas: Json | null
          premium_insights: Json | null
          recommendations: Json | null
          report_status: string | null
          strengths: Json | null
          summary: string | null
          week_label: string
        }
        Insert: {
          child_id: string
          confidence_note?: string | null
          created_at?: string
          id?: string
          improvement_areas?: Json | null
          premium_insights?: Json | null
          recommendations?: Json | null
          report_status?: string | null
          strengths?: Json | null
          summary?: string | null
          week_label: string
        }
        Update: {
          child_id?: string
          confidence_note?: string | null
          created_at?: string
          id?: string
          improvement_areas?: Json | null
          premium_insights?: Json | null
          recommendations?: Json | null
          report_status?: string | null
          strengths?: Json | null
          summary?: string | null
          week_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_reports_child_id_fkey"
            columns: ["child_id"]
            isOneToOne: false
            referencedRelation: "children"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_student_child_id: {
        Args: { student_user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { check_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "parent" | "student" | "admin"
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
    Enums: {
      app_role: ["parent", "student", "admin"],
    },
  },
} as const
