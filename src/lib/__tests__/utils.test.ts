import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn Utility (clsx + tailwind-merge)", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2 py-1", "bg-primary")).toBe("px-2 py-1 bg-primary");
  });

  it("should override conflicting Tailwind classes", () => {
    expect(cn("px-2 px-4", "text-red-500 text-blue-500")).toBe("px-4 text-blue-500");
  });

  it("should handle conditional class names", () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn("base", isTrue && "active", isFalse && "disabled")).toBe("base active");
  });
});
