import { describe, it, expect, vi } from "vitest";
import { getSantriCount, getGuruCount, getHalaqohCount } from "../dashboard.queries";
import * as firestore from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({})),
  query: vi.fn(() => ({})),
  where: vi.fn(() => ({})),
  getCountFromServer: vi.fn(),
}));

describe("Dashboard Firestore Queries", () => {
  it("should fetch active santri count (where isAlumni == false)", async () => {
    vi.mocked(firestore.getCountFromServer).mockResolvedValueOnce({
      data: () => ({ count: 120 }),
    } as any);

    const count = await getSantriCount();

    expect(count).toBe(120);
    expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), "santri");
    expect(firestore.where).toHaveBeenCalledWith("isAlumni", "==", false);
  });

  it("should fetch total guru count", async () => {
    vi.mocked(firestore.getCountFromServer).mockResolvedValueOnce({
      data: () => ({ count: 15 }),
    } as any);

    const count = await getGuruCount();

    expect(count).toBe(15);
    expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), "guru");
  });

  it("should fetch total halaqoh count", async () => {
    vi.mocked(firestore.getCountFromServer).mockResolvedValueOnce({
      data: () => ({ count: 10 }),
    } as any);

    const count = await getHalaqohCount();

    expect(count).toBe(10);
    expect(firestore.collection).toHaveBeenCalledWith(expect.anything(), "halaqoh");
  });
});
