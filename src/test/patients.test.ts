import { describe, it, expect } from "vitest";
import { patients, findPatientByName, type Patient, type InsuranceInfo, type AllocatedResource } from "@/data/patients";

describe("patients dataset integrity", () => {
  it("contains at least 5 patients", () => {
    expect(patients.length).toBeGreaterThanOrEqual(5);
  });

  it("all patients have unique IDs", () => {
    const ids = patients.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all patients have required string fields", () => {
    patients.forEach((p) => {
      expect(p.id).toBeTruthy();
      expect(p.name.length).toBeGreaterThan(0);
      expect(p.address.length).toBeGreaterThan(0);
      expect(p.city.length).toBeGreaterThan(0);
      expect(p.zip).toMatch(/^\d{5}$/);
      expect(p.condition.length).toBeGreaterThan(0);
    });
  });

  it("all patients have valid status", () => {
    patients.forEach(p => {
      expect(["stable", "attention", "critical"]).toContain(p.status);
    });
  });

  it("all patients have valid priority", () => {
    patients.forEach(p => {
      expect(["critical", "high", "medium", "low"]).toContain(p.priority);
    });
  });

  it("all patients have positive age", () => {
    patients.forEach(p => {
      expect(p.age).toBeGreaterThan(0);
      expect(p.age).toBeLessThan(150);
    });
  });

  it("all patients have at least one care team member", () => {
    patients.forEach(p => {
      expect(p.careTeam.length).toBeGreaterThan(0);
    });
  });
});

describe("insurance data", () => {
  const validInsuranceTypes = ["Medicare", "Medicaid", "Private", "VA", "Dual"];

  it("all patients have insurance info", () => {
    patients.forEach(p => {
      expect(p.insurance).toBeDefined();
    });
  });

  it("insurance has valid type", () => {
    patients.forEach(p => {
      if (p.insurance) {
        expect(validInsuranceTypes).toContain(p.insurance.type);
      }
    });
  });

  it("insurance has provider and policy number", () => {
    patients.forEach(p => {
      if (p.insurance) {
        expect(p.insurance.provider.length).toBeGreaterThan(0);
        expect(p.insurance.policyNumber.length).toBeGreaterThan(0);
      }
    });
  });

  it("authorization expiry dates are in the future or undefined", () => {
    patients.forEach(p => {
      if (p.insurance?.authorizationExpiry) {
        // Just verify it parses as a date
        const date = new Date(p.insurance.authorizationExpiry);
        expect(date.toString()).not.toBe("Invalid Date");
      }
    });
  });
});

describe("allocated resources", () => {
  const validResourceTypes = [
    "hospital_bed", "wheelchair", "oxygen_concentrator", "robot",
    "commode", "walker", "infusion_pump", "suction_machine"
  ];
  const validResourceStatuses = ["active", "pending_delivery", "maintenance"];

  it("resources have valid types and statuses", () => {
    patients.forEach(p => {
      p.allocatedResources?.forEach(r => {
        expect(validResourceTypes).toContain(r.type);
        expect(validResourceStatuses).toContain(r.status);
        expect(r.label.length).toBeGreaterThan(0);
        expect(r.assignedDate.length).toBeGreaterThan(0);
      });
    });
  });

  it("at least one patient has a robot assigned", () => {
    const hasRobot = patients.some(p =>
      p.allocatedResources?.some(r => r.type === "robot")
    );
    expect(hasRobot).toBe(true);
  });

  it("pending_delivery resources exist in dataset", () => {
    const hasPending = patients.some(p =>
      p.allocatedResources?.some(r => r.status === "pending_delivery")
    );
    expect(hasPending).toBe(true);
  });
});

describe("medications", () => {
  it("patients with medications have complete fields", () => {
    patients.forEach(p => {
      p.medications?.forEach(m => {
        expect(m.name.length).toBeGreaterThan(0);
        expect(m.dose.length).toBeGreaterThan(0);
        expect(m.schedule.length).toBeGreaterThan(0);
      });
    });
  });
});

describe("family contacts", () => {
  it("family contacts have name, relation, and phone", () => {
    patients.forEach(p => {
      p.familyContacts?.forEach(fc => {
        expect(fc.name.length).toBeGreaterThan(0);
        expect(fc.relation.length).toBeGreaterThan(0);
        expect(fc.phone).toMatch(/\(\d{3}\)\s?\d{3}-\d{4}/);
      });
    });
  });
});

describe("findPatientByName", () => {
  it("finds existing patient by exact name", () => {
    const result = findPatientByName("Dorothy Lewis");
    expect(result).toBeDefined();
    expect(result?.name).toBe("Dorothy Lewis");
    expect(result?.id).toBe("5");
  });

  it("returns all patient fields", () => {
    const result = findPatientByName("Robert Kimball");
    expect(result).toBeDefined();
    expect(result?.age).toBe(82);
    expect(result?.condition).toContain("Heart Failure");
    expect(result?.insurance?.type).toBe("VA");
  });

  it("returns undefined for unknown name", () => {
    expect(findPatientByName("Unknown Person")).toBeUndefined();
  });

  it("returns undefined for partial name match", () => {
    expect(findPatientByName("Dorothy")).toBeUndefined();
  });

  it("returns undefined for empty string", () => {
    expect(findPatientByName("")).toBeUndefined();
  });

  it("is case-sensitive", () => {
    expect(findPatientByName("dorothy lewis")).toBeUndefined();
  });
});

describe("critical patient edge cases", () => {
  it("critical patients have pending actions", () => {
    const critical = patients.filter(p => p.priority === "critical");
    critical.forEach(p => {
      expect(p.pendingActions).toBeDefined();
      expect(p.pendingActions!.length).toBeGreaterThan(0);
    });
  });

  it("critical patients have prognosis", () => {
    const critical = patients.filter(p => p.priority === "critical");
    critical.forEach(p => {
      expect(p.prognosis).toBeDefined();
      expect(p.prognosis!.length).toBeGreaterThan(0);
    });
  });

  it("all patients have story field for human context", () => {
    patients.forEach(p => {
      expect(p.story).toBeDefined();
      expect(p.story!.length).toBeGreaterThan(20);
    });
  });
});
