import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { AuthGuard } from "../auth-guard";
import { useAuthStore } from "@/stores/auth.store";
import { mockRouter } from "../../../../../vitest.setup";

describe("AuthGuard Component", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      status: "unauthenticated",
      errorMessage: null,
    });
  });

  it("should show loading spinner/text when status is loading", () => {
    useAuthStore.setState({ status: "loading" });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText("Memuat...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should redirect to /login when user is unauthenticated", () => {
    useAuthStore.setState({ status: "unauthenticated", user: null });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(mockRouter.replace).toHaveBeenCalledWith("/login");
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render children when user is authenticated", () => {
    useAuthStore.setState({
      status: "authenticated",
      user: {
        uid: "admin-1",
        role: "admin",
        displayName: "Ustadz Admin",
        identifier: "19880501201501",
        linkedDocId: "g1",
        programType: "R",
      },
    });

    renderWithProviders(
      <AuthGuard>
        <div>Protected Content</div>
      </AuthGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
