import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/test-utils";
import { LoginForm } from "../login-form";
import { useAuthStore } from "@/stores/auth.store";
import * as authActions from "@/features/auth/actions/auth.actions";

vi.mock("@/features/auth/actions/auth.actions", () => ({
  login: vi.fn(),
}));

describe("LoginForm Component", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      status: "unauthenticated",
      errorMessage: null,
    });
  });

  it("should render input fields and submit button", () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText(/NIP \/ NIS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kata Sandi|Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Log In|Masuk|Sign In/i })).toBeInTheDocument();
  });

  it("should show validation errors when submitting empty fields", async () => {
    renderWithProviders(<LoginForm />);

    const submitBtn = screen.getByRole("button", { name: /Log In|Masuk|Sign In/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("NIP/NIS wajib diisi")).toBeInTheDocument();
      expect(screen.getByText("Password wajib diisi")).toBeInTheDocument();
    });

    expect(authActions.login).not.toHaveBeenCalled();
  });

  it("should toggle password visibility when eye icon button is clicked", async () => {
    renderWithProviders(<LoginForm />);

    const passwordInput = screen.getByLabelText(/Kata Sandi|Password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /Show password/i });
    await userEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("should call login action when form is submitted with values", async () => {
    renderWithProviders(<LoginForm />);

    const identifierInput = screen.getByLabelText(/NIP \/ NIS/i);
    const passwordInput = screen.getByLabelText(/Kata Sandi|Password/i);
    const submitBtn = screen.getByRole("button", { name: /Log In|Masuk|Sign In/i });

    await userEvent.type(identifierInput, "19880501201501");
    await userEvent.type(passwordInput, "secret123");
    await userEvent.click(submitBtn);

    await waitFor(() => {
      expect(authActions.login).toHaveBeenCalledWith("19880501201501", "secret123");
    });
  });

  it("should render error message if store contains errorMessage", () => {
    useAuthStore.setState({
      errorMessage: "Akun ini tidak memiliki akses ke Web Admin.",
    });

    renderWithProviders(<LoginForm />);

    expect(screen.getByText("Akun ini tidak memiliki akses ke Web Admin.")).toBeInTheDocument();
  });
});
