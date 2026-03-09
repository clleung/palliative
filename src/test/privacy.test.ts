import { describe, it, expect } from "vitest";
import { abbreviateName, getInitials, getAvatarColor } from "@/lib/privacy";

describe("abbreviateName", () => {
  it("abbreviates a full name correctly", () => {
    expect(abbreviateName("Eleanor Wright")).toBe("E.WRI");
  });

  it("abbreviates with long last name", () => {
    expect(abbreviateName("Margaret Henderson")).toBe("M.HEN");
  });

  it("handles single-word names gracefully", () => {
    const result = abbreviateName("Cher");
    expect(result).toBe("C.***");
  });

  it("handles names with middle name", () => {
    expect(abbreviateName("James Robert Mitchell")).toBe("J.MIT");
  });

  it("handles extra whitespace", () => {
    expect(abbreviateName("  Dorothy   Lewis  ")).toBe("D.LEW");
  });

  it("handles short last names", () => {
    expect(abbreviateName("John Li")).toBe("J.LI");
  });
});

describe("getInitials", () => {
  it("returns two-character initials", () => {
    expect(getInitials("Sarah Chen")).toBe("SC");
  });

  it("handles single name", () => {
    expect(getInitials("Sarah")).toBe("S");
  });

  it("truncates to 2 chars for 3+ names", () => {
    expect(getInitials("Mary Jane Watson")).toBe("MJ");
  });
});

describe("getAvatarColor", () => {
  it("returns a gradient string", () => {
    const result = getAvatarColor("Eleanor Wright");
    expect(result).toContain("from-");
    expect(result).toContain("to-");
  });

  it("is deterministic", () => {
    expect(getAvatarColor("Bob")).toBe(getAvatarColor("Bob"));
  });
});
