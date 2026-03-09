import { describe, it, expect } from "vitest";
import { todayVisits, weeklyVisits } from "@/data/visits";

describe("todayVisits", () => {
  it("has visits scheduled", () => {
    expect(todayVisits.length).toBeGreaterThan(0);
  });

  it("all visits have valid statuses", () => {
    todayVisits.forEach((v) => {
      expect(["completed", "current", "upcoming"]).toContain(v.status);
    });
  });

  it("all visits have valid coordinates", () => {
    todayVisits.forEach((v) => {
      expect(v.lat).toBeGreaterThan(0);
      expect(v.lng).toBeLessThan(0); // Portland, OR is negative longitude
    });
  });

  it("all visits belong to Monday (dayOfWeek 0)", () => {
    todayVisits.forEach((v) => {
      expect(v.dayOfWeek).toBe(0);
    });
  });

  it("visits have non-negative location time estimates", () => {
    todayVisits.forEach((v) => {
      expect(v.estimatedMinAtLocation).toBeGreaterThan(0);
    });
  });
});

describe("weeklyVisits", () => {
  it("includes all today visits", () => {
    todayVisits.forEach((tv) => {
      expect(weeklyVisits.find((wv) => wv.id === tv.id)).toBeDefined();
    });
  });

  it("covers multiple days of the week", () => {
    const days = new Set(weeklyVisits.map((v) => v.dayOfWeek));
    expect(days.size).toBeGreaterThanOrEqual(3);
  });

  it("has unique visit IDs", () => {
    const ids = weeklyVisits.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
