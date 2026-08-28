import { describe, expect, it } from "vitest";
import { hasAdminAccess } from "../../lib/security/admin-access";

describe("admin access", () => {
  it("fails closed when the email allowlist is empty", () => {
    expect(hasAdminAccess({ email: "admin@example.com", role: "admin" }, "")).toBe(false);
  });

  it("requires both the trusted role and allowlisted email", () => {
    expect(hasAdminAccess({ email: "admin@example.com", role: "user" }, "admin@example.com")).toBe(false);
    expect(hasAdminAccess({ email: "other@example.com", role: "admin" }, "admin@example.com")).toBe(false);
    expect(hasAdminAccess({ email: "ADMIN@example.com", role: "admin" }, "admin@example.com")).toBe(true);
  });
});
