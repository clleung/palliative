import { describe, it, expect } from "vitest";
import { abbreviateName, getInitials, getAvatarColor } from "@/lib/privacy";

describe("abbreviateName", () => {
  // Standard cases
  it("abbreviates 'Eleanor Wright' to 'E.WRI'", () => {
    expect(abbreviateName("Eleanor Wright")).toBe("E.WRI");
  });
  it("abbreviates 'Margaret Henderson' to 'M.HEN'", () => {
    expect(abbreviateName("Margaret Henderson")).toBe("M.HEN");
  });
  it("abbreviates 'Robert Kimball' to 'R.KIM'", () => {
    expect(abbreviateName("Robert Kimball")).toBe("R.KIM");
  });

  // Edge cases — single name
  it("handles single-word name", () => {
    expect(abbreviateName("Cher")).toBe("C.***");
  });
  it("handles single character name", () => {
    expect(abbreviateName("X")).toBe("X.***");
  });

  // Edge cases — multi-word
  it("uses last name for 3-part names", () => {
    expect(abbreviateName("Mary Jane Watson")).toBe("M.WAT");
  });
  it("handles hyphenated last names", () => {
    expect(abbreviateName("Jean-Pierre Dupont")).toBe("J.DUP");
  });

  // Edge cases — whitespace
  it("handles leading/trailing spaces", () => {
    expect(abbreviateName("  Dorothy   Lewis  ")).toBe("D.LEW");
  });
  it("handles tabs mixed with spaces", () => {
    expect(abbreviateName("John\tDoe")).toBe("J.DOE");
  });

  // Edge cases — short last names
  it("handles 2-char last name", () => {
    expect(abbreviateName("John Li")).toBe("J.LI");
  });
  it("handles 1-char last name", () => {
    expect(abbreviateName("John X")).toBe("J.X");
  });

  // Edge cases — unicode/special
  it("handles accented characters", () => {
    const result = abbreviateName("José García");
    expect(result).toBe("J.GAR");
  });

  // Edge cases — case normalization
  it("uppercases lowercase input", () => {
    expect(abbreviateName("john doe")).toBe("J.DOE");
  });
  it("handles all caps", () => {
    expect(abbreviateName("JOHN DOE")).toBe("J.DOE");
  });
});

describe("getInitials", () => {
  it("returns 'SC' for 'Sarah Chen'", () => {
    expect(getInitials("Sarah Chen")).toBe("SC");
  });
  it("returns single char for single name", () => {
    expect(getInitials("Madonna")).toBe("M");
  });
  it("truncates to 2 for 3-word names", () => {
    expect(getInitials("Mary Jane Watson")).toBe("MJ");
  });
  it("handles empty-ish input", () => {
    expect(getInitials("A")).toBe("A");
  });
});

describe("getAvatarColor", () => {
  it("returns a gradient string with from- and to-", () => {
    const result = getAvatarColor("Eleanor Wright");
    expect(result).toMatch(/^from-/);
    expect(result).toContain("to-");
  });
  it("is deterministic for same input", () => {
    expect(getAvatarColor("Bob")).toBe(getAvatarColor("Bob"));
  });
  it("different names can produce different colors", () => {
    // Not guaranteed for all pairs, but statistically likely
    const colors = new Set(["Alice", "Bob", "Charlie", "Dave", "Eve"].map(getAvatarColor));
    expect(colors.size).toBeGreaterThanOrEqual(2);
  });
});
