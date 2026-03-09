import { describe, it, expect } from "vitest";
import { patients, findPatientByName } from "@/data/patients";

describe("patients data", () => {
  it("contains at least 5 patients", () => {
    expect(patients.length).toBeGreaterThanOrEqual(5);
  });

  it("all patients have required fields", () => {
    patients.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.age).toBeGreaterThan(0);
      expect(p.city).toBeTruthy();
      expect(["stable", "attention", "critical"]).toContain(p.status);
      expect(["critical", "high", "medium", "low"]).toContain(p.priority);
    });
  });

  it("all patients have insurance info", () => {
    patients.forEach((p) => {
      expect(p.insurance).toBeDefined();
      expect(p.insurance?.provider).toBeTruthy();
      expect(p.insurance?.policyNumber).toBeTruthy();
    });
  });

  it("patients with allocated resources have valid types", () => {
    const validTypes = ["hospital_bed", "wheelchair", "oxygen_concentrator", "robot", "commode", "walker", "infusion_pump", "suction_machine"];
    patients.forEach((p) => {
      p.allocatedResources?.forEach((r) => {
        expect(validTypes).toContain(r.type);
        expect(["active", "pending_delivery", "maintenance"]).toContain(r.status);
      });
    });
  });
});

describe("findPatientByName", () => {
  it("finds existing patient", () => {
    const result = findPatientByName("Dorothy Lewis");
    expect(result).toBeDefined();
    expect(result?.name).toBe("Dorothy Lewis");
  });

  it("returns undefined for unknown name", () => {
    expect(findPatientByName("Unknown Person")).toBeUndefined();
  });
});
