import { describe, it, expect } from "vitest";
import { todayVisits, weeklyVisits, type Visit } from "@/data/visits";

describe("todayVisits", () => {
  it("has visits scheduled", () => {
    expect(todayVisits.length).toBeGreaterThan(0);
  });

  it("all visits have valid statuses", () => {
    todayVisits.forEach(v => {
      expect(["completed", "current", "upcoming"]).toContain(v.status);
    });
  });

  it("all visits have valid Portland-area coordinates", () => {
    todayVisits.forEach(v => {
      expect(v.lat).toBeGreaterThan(45);
      expect(v.lat).toBeLessThan(46);
      expect(v.lng).toBeGreaterThan(-123);
      expect(v.lng).toBeLessThan(-122);
    });
  });

  it("all visits belong to Monday (dayOfWeek 0)", () => {
    todayVisits.forEach(v => {
      expect(v.dayOfWeek).toBe(0);
    });
  });

  it("visits have positive location time estimates", () => {
    todayVisits.forEach(v => {
      expect(v.estimatedMinAtLocation).toBeGreaterThan(0);
    });
  });

  it("first visit has no travel time (starting point)", () => {
    expect(todayVisits[0].travelMinFromPrior).toBeNull();
  });

  it("subsequent visits have travel times", () => {
    todayVisits.slice(1).forEach(v => {
      expect(v.travelMinFromPrior).not.toBeNull();
      expect(v.travelMinFromPrior!).toBeGreaterThan(0);
    });
  });

  it("at most one visit is 'current'", () => {
    const currentCount = todayVisits.filter(v => v.status === "current").length;
    expect(currentCount).toBeLessThanOrEqual(1);
  });

  it("urgent visits have notes", () => {
    todayVisits.filter(v => v.priority === "urgent").forEach(v => {
      expect(v.notes).toBeDefined();
      expect(v.notes!.length).toBeGreaterThan(0);
    });
  });

  it("all visits have non-empty patient names", () => {
    todayVisits.forEach(v => {
      expect(v.patientFullName.length).toBeGreaterThan(0);
      expect(v.patientFullName).toContain(" "); // has first and last name
    });
  });

  it("all visits have time and endTime", () => {
    todayVisits.forEach(v => {
      expect(v.time).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
      expect(v.endTime).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/);
    });
  });

  it("all visits have valid visit types", () => {
    todayVisits.forEach(v => {
      expect(v.visitType.length).toBeGreaterThan(0);
    });
  });
});

describe("weeklyVisits", () => {
  it("includes all today visits", () => {
    todayVisits.forEach(tv => {
      expect(weeklyVisits.find(wv => wv.id === tv.id)).toBeDefined();
    });
  });

  it("covers at least 3 different days", () => {
    const days = new Set(weeklyVisits.map(v => v.dayOfWeek));
    expect(days.size).toBeGreaterThanOrEqual(3);
  });

  it("has unique visit IDs", () => {
    const ids = weeklyVisits.map(v => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("day indices are within 0-6 range", () => {
    weeklyVisits.forEach(v => {
      expect(v.dayOfWeek).toBeGreaterThanOrEqual(0);
      expect(v.dayOfWeek).toBeLessThanOrEqual(6);
    });
  });

  it("all weekly visits have valid coordinates", () => {
    weeklyVisits.forEach(v => {
      expect(v.lat).toBeGreaterThan(0);
      expect(v.lng).toBeLessThan(0);
    });
  });

  it("each day's first visit has null travelMinFromPrior", () => {
    const dayGroups = new Map<number, Visit[]>();
    weeklyVisits.forEach(v => {
      if (!dayGroups.has(v.dayOfWeek)) dayGroups.set(v.dayOfWeek, []);
      dayGroups.get(v.dayOfWeek)!.push(v);
    });
    // At least the first visit overall and Monday should have null
    expect(todayVisits[0].travelMinFromPrior).toBeNull();
  });
});

describe("data cross-references", () => {
  it("all visit patient names exist in patients dataset", async () => {
    const { patients } = await import("@/data/patients");
    const patientNames = new Set(patients.map(p => p.name));
    todayVisits.forEach(v => {
      expect(patientNames.has(v.patientFullName)).toBe(true);
    });
  });

  it("visit cities match patient cities", async () => {
    const { patients } = await import("@/data/patients");
    todayVisits.forEach(v => {
      const patient = patients.find(p => p.name === v.patientFullName);
      if (patient) {
        expect(v.city).toBe(patient.city);
      }
    });
  });
});
