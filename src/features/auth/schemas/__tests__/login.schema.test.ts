import { describe, it, expect } from "vitest";
import { loginSchema } from "../login.schema";

describe("Login Schema Zod Validation", () => {
  it("should fail validation when identifier is empty", () => {
    const result = loginSchema.safeParse({ identifier: "", password: "password123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("NIP/NIS wajib diisi");
    }
  });

  it("should fail validation when password is empty", () => {
    const result = loginSchema.safeParse({ identifier: "19880501201501", password: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password wajib diisi");
    }
  });

  it("should pass validation with valid identifier and password", () => {
    const result = loginSchema.safeParse({
      identifier: "19880501201501",
      password: "adminpassword",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        identifier: "19880501201501",
        password: "adminpassword",
      });
    }
  });
});
