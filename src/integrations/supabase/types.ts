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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      device_readings: {
        Row: {
          device_serial: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          id: string
          is_abnormal: boolean | null
          metadata: Json | null
          patient_id: string
          reading_type: string
          recorded_at: string | null
          synced_at: string | null
          unit: string
          value: number
        }
        Insert: {
          device_serial?: string | null
          device_type: Database["public"]["Enums"]["device_type"]
          id?: string
          is_abnormal?: boolean | null
          metadata?: Json | null
          patient_id: string
          reading_type: string
          recorded_at?: string | null
          synced_at?: string | null
          unit: string
          value: number
        }
        Update: {
          device_serial?: string | null
          device_type?: Database["public"]["Enums"]["device_type"]
          id?: string
          is_abnormal?: boolean | null
          metadata?: Json | null
          patient_id?: string
          reading_type?: string
          recorded_at?: string | null
          synced_at?: string | null
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "device_readings_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_conditions: {
        Row: {
          condition_type: string
          created_at: string | null
          disability_type: Database["public"]["Enums"]["disability_type"] | null
          id: string
          is_high_risk_medication: boolean | null
          medication_category: string | null
          notes: string | null
          patient_id: string
        }
        Insert: {
          condition_type: string
          created_at?: string | null
          disability_type?:
            | Database["public"]["Enums"]["disability_type"]
            | null
          id?: string
          is_high_risk_medication?: boolean | null
          medication_category?: string | null
          notes?: string | null
          patient_id: string
        }
        Update: {
          condition_type?: string
          created_at?: string | null
          disability_type?:
            | Database["public"]["Enums"]["disability_type"]
            | null
          id?: string
          is_high_risk_medication?: boolean | null
          medication_category?: string | null
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_conditions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_consents: {
        Row: {
          consent_type: string
          granted: boolean | null
          granted_at: string | null
          id: string
          patient_id: string | null
          recorded_by: string | null
          revoked_at: string | null
        }
        Insert: {
          consent_type: string
          granted?: boolean | null
          granted_at?: string | null
          id?: string
          patient_id?: string | null
          recorded_by?: string | null
          revoked_at?: string | null
        }
        Update: {
          consent_type?: string
          granted?: boolean | null
          granted_at?: string | null
          id?: string
          patient_id?: string | null
          recorded_by?: string | null
          revoked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_consents_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string | null
          dob: string
          first_name: string
          id: string
          last_name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dob: string
          first_name: string
          id?: string
          last_name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dob?: string
          first_name?: string
          id?: string
          last_name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      robot_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          notes: string | null
          patient_id: string
          priority: number | null
          robot_id: string | null
          scheduled_at: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["robot_task_status"] | null
          task_type: Database["public"]["Enums"]["robot_task_type"]
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          priority?: number | null
          robot_id?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["robot_task_status"] | null
          task_type: Database["public"]["Enums"]["robot_task_type"]
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          priority?: number | null
          robot_id?: string | null
          scheduled_at?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["robot_task_status"] | null
          task_type?: Database["public"]["Enums"]["robot_task_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "robot_tasks_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "robot_tasks_robot_id_fkey"
            columns: ["robot_id"]
            isOneToOne: false
            referencedRelation: "robots"
            referencedColumns: ["id"]
          },
        ]
      }
      robots: {
        Row: {
          assigned_patient_id: string | null
          battery_level: number | null
          created_at: string | null
          current_location: string | null
          id: string
          last_maintenance_at: string | null
          last_seen_at: string | null
          model: string | null
          name: string
          robot_id: string
          status: Database["public"]["Enums"]["robot_status"] | null
          updated_at: string | null
        }
        Insert: {
          assigned_patient_id?: string | null
          battery_level?: number | null
          created_at?: string | null
          current_location?: string | null
          id?: string
          last_maintenance_at?: string | null
          last_seen_at?: string | null
          model?: string | null
          name: string
          robot_id: string
          status?: Database["public"]["Enums"]["robot_status"] | null
          updated_at?: string | null
        }
        Update: {
          assigned_patient_id?: string | null
          battery_level?: number | null
          created_at?: string | null
          current_location?: string | null
          id?: string
          last_maintenance_at?: string | null
          last_seen_at?: string | null
          model?: string | null
          name?: string
          robot_id?: string
          status?: Database["public"]["Enums"]["robot_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "robots_assigned_patient_id_fkey"
            columns: ["assigned_patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      worker_profiles: {
        Row: {
          avatar_url: string | null
          biometric_enrolled: boolean | null
          certifications: string[] | null
          created_at: string
          department: string | null
          display_name: string
          id: string
          job_title: string | null
          last_login_at: string | null
          mfa_enrolled: boolean | null
          phone: string | null
          updated_at: string
          user_id: string
          worker_id: string
        }
        Insert: {
          avatar_url?: string | null
          biometric_enrolled?: boolean | null
          certifications?: string[] | null
          created_at?: string
          department?: string | null
          display_name: string
          id?: string
          job_title?: string | null
          last_login_at?: string | null
          mfa_enrolled?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id: string
          worker_id: string
        }
        Update: {
          avatar_url?: string | null
          biometric_enrolled?: boolean | null
          certifications?: string[] | null
          created_at?: string
          department?: string | null
          display_name?: string
          id?: string
          job_title?: string | null
          last_login_at?: string | null
          mfa_enrolled?: boolean | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          worker_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "nurse" | "cna" | "coordinator" | "supervisor"
      audit_action: "SELECT" | "INSERT" | "UPDATE" | "DELETE"
      device_type:
        | "smartwatch"
        | "blood_pressure"
        | "pulse_oximeter"
        | "glucose_monitor"
        | "weight_scale"
        | "thermometer"
        | "ecg_monitor"
      disability_type:
        | "visual"
        | "hearing"
        | "mobility"
        | "cognitive"
        | "speech"
      robot_status:
        | "idle"
        | "charging"
        | "in_transit"
        | "on_task"
        | "maintenance"
        | "offline"
      robot_task_status:
        | "pending"
        | "assigned"
        | "in_progress"
        | "completed"
        | "failed"
        | "cancelled"
      robot_task_type:
        | "delivery"
        | "check_in"
        | "vitals_collection"
        | "medication_reminder"
        | "emergency_response"
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
      app_role: ["admin", "nurse", "cna", "coordinator", "supervisor"],
      audit_action: ["SELECT", "INSERT", "UPDATE", "DELETE"],
      device_type: [
        "smartwatch",
        "blood_pressure",
        "pulse_oximeter",
        "glucose_monitor",
        "weight_scale",
        "thermometer",
        "ecg_monitor",
      ],
      disability_type: ["visual", "hearing", "mobility", "cognitive", "speech"],
      robot_status: [
        "idle",
        "charging",
        "in_transit",
        "on_task",
        "maintenance",
        "offline",
      ],
      robot_task_status: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "failed",
        "cancelled",
      ],
      robot_task_type: [
        "delivery",
        "check_in",
        "vitals_collection",
        "medication_reminder",
        "emergency_response",
      ],
    },
  },
} as const
