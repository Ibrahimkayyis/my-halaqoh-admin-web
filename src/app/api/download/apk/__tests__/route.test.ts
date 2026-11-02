import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { GET } from "../route";

describe("GET /api/download/apk", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("should redirect to APK download URL when an APK asset is found", async () => {
    const mockApkUrl =
      "https://github.com/Ibrahimkayyis/my_halaqoh/releases/download/v1.1.0/my_halaqoh_v1.1.0.apk";

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        assets: [
          {
            name: "my_halaqoh_v1.1.0.apk",
            browser_download_url: mockApkUrl,
          },
        ],
      }),
    } as any);

    const response = await GET();

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(mockApkUrl);
  });

  it("should fallback to latest release page when no APK asset is present in release", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        assets: [
          {
            name: "source-code.zip",
            browser_download_url: "https://github.com/...",
          },
        ],
      }),
    } as any);

    const response = await GET();

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "https://github.com/Ibrahimkayyis/my_halaqoh/releases/latest"
    );
  });

  it("should fallback to latest release page when GitHub API returns non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    } as any);

    const response = await GET();

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "https://github.com/Ibrahimkayyis/my_halaqoh/releases/latest"
    );
  });

  it("should fallback to latest release page when fetch throws an error", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const response = await GET();

    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(
      "https://github.com/Ibrahimkayyis/my_halaqoh/releases/latest"
    );
  });
});
