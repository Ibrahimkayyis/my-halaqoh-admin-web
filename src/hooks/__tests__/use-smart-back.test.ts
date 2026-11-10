import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useSmartBack,
  sanitizeInternalPath,
  getContextualBackLabel,
} from "../use-smart-back";
import type { TFunction } from "i18next";

const mockPush = vi.fn();
let mockSearchParamsGet = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockSearchParamsGet,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
  }),
}));

describe("useSmartBack and utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsGet = vi.fn();
  });

  describe("sanitizeInternalPath", () => {
    it("should accept valid relative paths", () => {
      expect(sanitizeInternalPath("/halaqoh/detail/123")).toBe("/halaqoh/detail/123");
      expect(sanitizeInternalPath("/dashboard")).toBe("/dashboard");
      expect(sanitizeInternalPath("/santri?page=2&filter=active")).toBe("/santri?page=2&filter=active");
    });

    it("should reject open-redirect patterns and external schemes", () => {
      expect(sanitizeInternalPath("//malicious.com")).toBeNull();
      expect(sanitizeInternalPath("/\\malicious.com")).toBeNull();
      expect(sanitizeInternalPath("https://google.com")).toBeNull();
      expect(sanitizeInternalPath("http://attacker.com")).toBeNull();
      expect(sanitizeInternalPath("javascript:alert(1)")).toBeNull();
      expect(sanitizeInternalPath("")).toBeNull();
      expect(sanitizeInternalPath(null)).toBeNull();
      expect(sanitizeInternalPath(undefined)).toBeNull();
    });
  });

  describe("getContextualBackLabel", () => {
    const mockT = ((key: string, def?: string) => def || key) as unknown as TFunction;

    it("should return contextual labels based on path prefix", () => {
      expect(getContextualBackLabel("/halaqoh/detail/123", mockT)).toBe("Kembali ke Detail Halaqoh");
      expect(getContextualBackLabel("/halaqoh", mockT)).toBe("Kembali ke Daftar Halaqoh");
      expect(getContextualBackLabel("/dashboard", mockT)).toBe("Kembali ke Dashboard");
      expect(getContextualBackLabel("/sertifikasi-tahfidz", mockT)).toBe("Kembali ke Sertifikasi");
      expect(getContextualBackLabel("/santri", mockT)).toBe("Kembali ke Daftar Santri");
      expect(getContextualBackLabel("/guru", mockT)).toBe("Kembali ke Daftar Guru");
    });

    it("should return default label for other internal paths", () => {
      expect(getContextualBackLabel("/pengaturan", mockT, "Kembali ke Pengaturan")).toBe("Kembali ke Pengaturan");
      expect(getContextualBackLabel("/custom-path", mockT)).toBe("Kembali");
    });
  });

  describe("useSmartBack hook", () => {
    it("should return default values when searchParams has no from param", () => {
      mockSearchParamsGet.mockReturnValue(null);

      const { result } = renderHook(() =>
        useSmartBack("/santri", "Kembali ke Daftar Santri")
      );

      expect(result.current.backHref).toBe("/santri");
      expect(result.current.backLabel).toBe("Kembali ke Daftar Santri");
      expect(result.current.isFromExternal).toBe(false);

      act(() => {
        result.current.handleBack();
      });
      expect(mockPush).toHaveBeenCalledWith("/santri");
    });

    it("should resolve valid from parameter from searchParams", () => {
      mockSearchParamsGet.mockImplementation((key) => {
        if (key === "from") return "/halaqoh/detail/abc-123";
        return null;
      });

      const { result } = renderHook(() =>
        useSmartBack("/santri", "Kembali ke Daftar Santri")
      );

      expect(result.current.backHref).toBe("/halaqoh/detail/abc-123");
      expect(result.current.backLabel).toBe("Kembali ke Detail Halaqoh");
      expect(result.current.isFromExternal).toBe(true);

      act(() => {
        result.current.handleBack();
      });
      expect(mockPush).toHaveBeenCalledWith("/halaqoh/detail/abc-123");
    });

    it("should fallback to defaultHref if from param contains an invalid/malicious URL", () => {
      mockSearchParamsGet.mockImplementation((key) => {
        if (key === "from") return "//evil.com";
        return null;
      });

      const { result } = renderHook(() =>
        useSmartBack("/santri", "Kembali ke Daftar Santri")
      );

      expect(result.current.backHref).toBe("/santri");
      expect(result.current.backLabel).toBe("Kembali ke Daftar Santri");
      expect(result.current.isFromExternal).toBe(false);
    });

    it("should allow customFrom prop to override searchParams", () => {
      mockSearchParamsGet.mockReturnValue(null);

      const { result } = renderHook(() =>
        useSmartBack("/santri", "Kembali ke Daftar Santri", "/dashboard")
      );

      expect(result.current.backHref).toBe("/dashboard");
      expect(result.current.backLabel).toBe("Kembali ke Dashboard");
      expect(result.current.isFromExternal).toBe(true);
    });
  });
});
