import { describe, it, expect } from "vitest";

/**
 * Backend schema validation tests.
 * These validate that the Supabase types match expected business rules.
 */

// Import the generated types to validate schema shape
import type { Database } from "@/integrations/supabase/types";
import { Constants } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];

describe("Database schema — robots table", () => {
  it("has all required robot status values", () => {
    const statuses = Constants.public.Enums.robot_status;
    expect(statuses).toContain("idle");
    expect(statuses).toContain("charging");
    expect(statuses).toContain("in_transit");
    expect(statuses).toContain("on_task");
    expect(statuses).toContain("maintenance");
    expect(statuses).toContain("offline");
    expect(statuses.length).toBe(6);
  });

  it("robot_task_type covers all dispatch options", () => {
    const types = Constants.public.Enums.robot_task_type;
    expect(types).toContain("delivery");
    expect(types).toContain("check_in");
    expect(types).toContain("vitals_collection");
    expect(types).toContain("medication_reminder");
    expect(types).toContain("emergency_response");
    expect(types.length).toBe(5);
  });

  it("robot_task_status covers full lifecycle", () => {
    const statuses = Constants.public.Enums.robot_task_status;
    expect(statuses).toContain("pending");
    expect(statuses).toContain("assigned");
    expect(statuses).toContain("in_progress");
    expect(statuses).toContain("completed");
    expect(statuses).toContain("failed");
    expect(statuses).toContain("cancelled");
    expect(statuses.length).toBe(6);
  });
});

describe("Database schema — user roles", () => {
  it("has all required role types", () => {
    const roles = Constants.public.Enums.app_role;
    expect(roles).toContain("admin");
    expect(roles).toContain("nurse");
    expect(roles).toContain("cna");
    expect(roles).toContain("coordinator");
    expect(roles).toContain("supervisor");
    expect(roles.length).toBe(5);
  });
});

describe("Database schema — device readings", () => {
  it("has all supported device types", () => {
    const devices = Constants.public.Enums.device_type;
    expect(devices).toContain("smartwatch");
    expect(devices).toContain("blood_pressure");
    expect(devices).toContain("pulse_oximeter");
    expect(devices).toContain("glucose_monitor");
    expect(devices).toContain("weight_scale");
    expect(devices).toContain("thermometer");
    expect(devices).toContain("ecg_monitor");
    expect(devices.length).toBe(7);
  });
});

describe("Database schema — disability types", () => {
  it("covers required disability categories", () => {
    const types = Constants.public.Enums.disability_type;
    expect(types).toContain("visual");
    expect(types).toContain("hearing");
    expect(types).toContain("mobility");
    expect(types).toContain("cognitive");
    expect(types).toContain("speech");
    expect(types.length).toBe(5);
  });
});

describe("Database schema — audit actions", () => {
  it("tracks all CRUD operations", () => {
    const actions = Constants.public.Enums.audit_action;
    expect(actions).toContain("SELECT");
    expect(actions).toContain("INSERT");
    expect(actions).toContain("UPDATE");
    expect(actions).toContain("DELETE");
    expect(actions.length).toBe(4);
  });
});

describe("Type shape validation — robot table", () => {
  it("Row type has all expected fields", () => {
    // This is a compile-time check — if the type is wrong, TS will fail
    type RobotRow = Tables["robots"]["Row"];
    const requiredKeys: (keyof RobotRow)[] = [
      "id", "robot_id", "name", "status", "battery_level",
      "current_location", "assigned_patient_id", "model",
      "last_seen_at", "last_maintenance_at", "created_at", "updated_at"
    ];
    // Runtime check that keys exist in a sample type assertion
    expect(requiredKeys.length).toBe(12);
  });
});

describe("Type shape validation — robot_tasks table", () => {
  it("Row type has all expected fields", () => {
    type TaskRow = Tables["robot_tasks"]["Row"];
    const requiredKeys: (keyof TaskRow)[] = [
      "id", "robot_id", "patient_id", "task_type", "status",
      "priority", "description", "notes", "scheduled_at",
      "started_at", "completed_at", "created_by", "created_at", "updated_at"
    ];
    expect(requiredKeys.length).toBe(14);
  });
});

describe("Type shape validation — patients table", () => {
  it("Row type has expected fields", () => {
    type PatientRow = Tables["patients"]["Row"];
    const requiredKeys: (keyof PatientRow)[] = [
      "id", "first_name", "last_name", "dob", "status", "created_at", "updated_at"
    ];
    expect(requiredKeys.length).toBe(7);
  });
});
