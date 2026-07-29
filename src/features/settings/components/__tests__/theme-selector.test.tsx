import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { ThemeSelector } from "../theme-selector";
import * as nextThemes from "next-themes";

vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

describe("ThemeSelector Component", () => {
  it("should render light, dark, and system theme option buttons", () => {
    const setTheme = vi.fn();
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: "system",
      setTheme,
    } as any);

    renderWithProviders(<ThemeSelector />);

    expect(screen.getByRole("button", { name: /Light Mode|Terang|Light/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dark Mode|Gelap|Dark/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /System|Sistem/i })).toBeInTheDocument();
  });

  it("should call setTheme when a theme option button is clicked", () => {
    const setTheme = vi.fn();
    vi.mocked(nextThemes.useTheme).mockReturnValue({
      theme: "light",
      setTheme,
    } as any);

    renderWithProviders(<ThemeSelector />);

    const darkBtn = screen.getByRole("button", { name: /Dark Mode|Gelap|Dark/i });
    fireEvent.click(darkBtn);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
