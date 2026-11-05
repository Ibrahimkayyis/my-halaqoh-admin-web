import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mapFeedbackDoc,
  updateFeedbackStatusAndResponse,
  FEEDBACK_COLLECTION,
} from "../feedback.queries";
import * as firestore from "firebase/firestore";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(() => ({})),
  doc: vi.fn(() => ({})),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ type: "serverTimestamp" })),
  Timestamp: {
    now: vi.fn(() => ({ toMillis: () => 1000 })),
  },
  onSnapshot: vi.fn(),
}));

describe("Feedback Firestore Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("mapFeedbackDoc", () => {
    it("should correctly map a complete feedback document snapshot", () => {
      const mockTimestamp = { toMillis: () => 123456789 };
      const mockDoc = {
        id: "fb-123",
        data: () => ({
          userId: "user-456",
          userName: "Ustadz Abdullah",
          userRole: "guru",
          userIdentifier: "G001",
          category: "bug",
          title: "Gagal simpan setoran",
          description: "Saat klik simpan muncul pesan error",
          attachmentUrls: ["https://example.com/screenshot.png"],
          appVersion: "v1.1.0+1",
          deviceModel: "Samsung Galaxy A52",
          osVersion: "Android 13",
          status: "open",
          adminResponse: null,
          resolvedAt: null,
          resolvedBy: null,
          resolvedNotifiedAt: null,
          createdAt: mockTimestamp,
        }),
      } as unknown as firestore.DocumentSnapshot;

      const result = mapFeedbackDoc(mockDoc);

      expect(result.id).toBe("fb-123");
      expect(result.userName).toBe("Ustadz Abdullah");
      expect(result.userRole).toBe("guru");
      expect(result.userIdentifier).toBe("G001");
      expect(result.category).toBe("bug");
      expect(result.title).toBe("Gagal simpan setoran");
      expect(result.attachmentUrls).toHaveLength(1);
      expect(result.status).toBe("open");
    });

    it("should handle missing or empty fields with sensible defaults", () => {
      const mockDoc = {
        id: "fb-empty",
        data: () => ({}),
      } as unknown as firestore.DocumentSnapshot;

      const result = mapFeedbackDoc(mockDoc);

      expect(result.id).toBe("fb-empty");
      expect(result.userName).toBe("Pengguna Tanpa Nama");
      expect(result.userRole).toBe("wali_santri");
      expect(result.category).toBe("pertanyaan");
      expect(result.status).toBe("open");
      expect(result.attachmentUrls).toEqual([]);
      expect(result.adminResponse).toBeNull();
    });
  });

  describe("updateFeedbackStatusAndResponse", () => {
    it("should update status to resolved with adminResponse, resolvedAt, and resolvedBy", async () => {
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined);

      await updateFeedbackStatusAndResponse("fb-123", {
        status: "resolved",
        adminResponse: " Masalah ini telah diperbaiki. ",
        adminName: "Super Admin",
      });

      expect(firestore.doc).toHaveBeenCalledWith(
        expect.anything(),
        FEEDBACK_COLLECTION,
        "fb-123"
      );
      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "resolved",
          adminResponse: "Masalah ini telah diperbaiki.",
          resolvedBy: "Super Admin",
        })
      );
      // Critical check: NEVER write resolvedNotifiedAt
      const updateCall = vi.mocked(firestore.updateDoc).mock.calls[0][1] as unknown as Record<string, unknown>;
      expect(updateCall).not.toHaveProperty("resolvedNotifiedAt");
    });

    it("should update status to in_progress without setting resolvedAt or resolvedNotifiedAt", async () => {
      vi.mocked(firestore.updateDoc).mockResolvedValueOnce(undefined);

      await updateFeedbackStatusAndResponse("fb-123", {
        status: "in_progress",
        adminResponse: "Sedang diinvestigasi",
        adminName: "Admin",
      });

      expect(firestore.updateDoc).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          status: "in_progress",
          adminResponse: "Sedang diinvestigasi",
        })
      );
      const updateCall = vi.mocked(firestore.updateDoc).mock.calls[0][1] as unknown as Record<string, unknown>;
      expect(updateCall).not.toHaveProperty("resolvedAt");
      expect(updateCall).not.toHaveProperty("resolvedNotifiedAt");
    });
  });
});
