import { describe, expect, it } from "vitest";
import { leaveRequestSchema, loginSchema, normalizeEmail } from "../lib/shared/validation";

describe("validation", () => {
  it("normalizes email", () => expect(normalizeEmail("  Test@Example.COM ")).toBe("test@example.com"));
  it("validates login", () => expect(loginSchema.safeParse({ email: "Test@Example.COM", password: "password1" }).success).toBe(true));
  it("rejects reversed leave dates", () => {
    const result = leaveRequestSchema.safeParse({ leaveType: "ANNUAL", startDate: "2026-10-20", endDate: "2026-10-19", reason: "Family trip" });
    expect(result.success).toBe(false);
  });
});
