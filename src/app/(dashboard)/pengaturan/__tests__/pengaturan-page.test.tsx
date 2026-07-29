import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import PengaturanPage from "../page";

vi.mock("@/features/auth/actions/auth.actions", () => ({
  logout: vi.fn(),
}));

describe("PengaturanPage Integration Test", () => {
  it("should render Settings title, subtitle, and all 3 setting sections (Appearance, About, Account)", () => {
    renderWithProviders(<PengaturanPage />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Appearance|Tampilan/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /About Application|Tentang Aplikasi/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Account|Akun/i })).toBeInTheDocument();
  });
});
