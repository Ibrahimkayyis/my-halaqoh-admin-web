import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { LogoutSection } from "../logout-section";
import { useAuthStore } from "@/stores/auth.store";
import * as authActions from "@/features/auth/actions/auth.actions";
import { mockRouter } from "../../../../../vitest.setup";

vi.mock("@/features/auth/actions/auth.actions", () => ({
  logout: vi.fn(),
}));

describe("LogoutSection Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: { uid: "admin-1", displayName: "Administrator Utama", role: "admin" } as any,
      status: "authenticated",
    });
  });

  it("should render logged in user display name and logout button", () => {
    renderWithProviders(<LogoutSection />);

    expect(screen.getByText(/Logged in as|Masuk sebagai/i)).toBeInTheDocument();
    expect(screen.getByText("Administrator Utama")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log Out|Keluar/i })).toBeInTheDocument();
  });

  it("should open confirm AlertDialog when logout button is clicked", () => {
    renderWithProviders(<LogoutSection />);

    const logoutTriggerBtn = screen.getByRole("button", { name: /Log Out|Keluar/i });
    fireEvent.click(logoutTriggerBtn);

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to log out|Apakah Anda yakin ingin keluar/i)).toBeInTheDocument();
  });

  it("should call logout action and navigate to login page on confirmation", async () => {
    vi.mocked(authActions.logout).mockResolvedValue(undefined as any);

    renderWithProviders(<LogoutSection />);

    const logoutTriggerBtn = screen.getByRole("button", { name: /Log Out|Keluar/i });
    fireEvent.click(logoutTriggerBtn);

    const confirmBtn = screen.getByRole("button", { name: /Yes, Log Out|Ya, Keluar|Keluar/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(authActions.logout).toHaveBeenCalledTimes(1);
      expect(mockRouter.push).toHaveBeenCalledWith("/login");
    });
  });
});
