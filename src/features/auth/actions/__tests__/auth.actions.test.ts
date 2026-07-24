import { describe, it, expect, vi, beforeEach } from "vitest";
import { login, logout } from "../auth.actions";
import { useAuthStore } from "@/stores/auth.store";
import * as firebaseAuth from "@/lib/firebase/auth";
import * as userQueries from "@/lib/firestore/queries/user.queries";
import type { UserDoc } from "@/types/models/user.types";

vi.mock("@/lib/firebase/auth", () => ({
  signInWithIdentifier: vi.fn(),
  signOutUser: vi.fn(),
  mapFirebaseAuthError: vi.fn((code: string) => `Mock error for ${code}`),
}));

vi.mock("@/lib/firestore/queries/user.queries", () => ({
  getUserDoc: vi.fn(),
}));

describe("Auth Actions", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      status: "unauthenticated",
      errorMessage: null,
    });
  });

  it("should login successfully when user is an admin", async () => {
    const mockFirebaseUser = { uid: "admin-uid-123" };
    const mockUserDoc: UserDoc = {
      uid: "admin-uid-123",
      identifier: "19880501201501",
      role: "admin",
      displayName: "Ustadz Admin",
      linkedDocId: "guru-1",
      programType: "R",
    };

    vi.mocked(firebaseAuth.signInWithIdentifier).mockResolvedValue(mockFirebaseUser as any);
    vi.mocked(userQueries.getUserDoc).mockResolvedValue(mockUserDoc);

    await login("19880501201501", "secret123");

    const state = useAuthStore.getState();
    expect(state.status).toBe("authenticated");
    expect(state.user).toEqual(mockUserDoc);
    expect(state.errorMessage).toBeNull();
  });

  it("should reject login and sign out if user role is not admin", async () => {
    const mockFirebaseUser = { uid: "guru-uid-456" };
    const mockUserDoc: UserDoc = {
      uid: "guru-uid-456",
      identifier: "19880501201502",
      role: "guru",
      displayName: "Ustadz Guru",
      linkedDocId: "guru-2",
      programType: "R",
    };

    vi.mocked(firebaseAuth.signInWithIdentifier).mockResolvedValue(mockFirebaseUser as any);
    vi.mocked(userQueries.getUserDoc).mockResolvedValue(mockUserDoc);

    await login("19880501201502", "secret123");

    const state = useAuthStore.getState();
    expect(state.status).toBe("error");
    expect(state.errorMessage).toBe("Akun ini tidak memiliki akses ke Web Admin.");
    expect(firebaseAuth.signOutUser).toHaveBeenCalled();
  });

  it("should reject login if user document is not found", async () => {
    const mockFirebaseUser = { uid: "unknown-uid" };

    vi.mocked(firebaseAuth.signInWithIdentifier).mockResolvedValue(mockFirebaseUser as any);
    vi.mocked(userQueries.getUserDoc).mockResolvedValue(null);

    await login("999999", "secret123");

    const state = useAuthStore.getState();
    expect(state.status).toBe("error");
    expect(state.errorMessage).toBe("Data pengguna tidak ditemukan. Hubungi administrator.");
    expect(firebaseAuth.signOutUser).toHaveBeenCalled();
  });

  it("should handle logout and set unauthenticated state", async () => {
    useAuthStore.setState({
      user: { uid: "admin-uid", role: "admin", identifier: "123", displayName: "Admin", linkedDocId: "1", programType: "R" },
      status: "authenticated",
    });

    await logout();

    const state = useAuthStore.getState();
    expect(state.status).toBe("unauthenticated");
    expect(state.user).toBeNull();
    expect(firebaseAuth.signOutUser).toHaveBeenCalled();
  });
});
