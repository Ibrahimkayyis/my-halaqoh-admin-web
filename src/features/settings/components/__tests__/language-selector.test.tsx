import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { LanguageSelector } from "../language-selector";
import i18n from "@/lib/i18n/config";

vi.spyOn(i18n, "changeLanguage").mockImplementation(() => Promise.resolve(i18n.t as any));

describe("LanguageSelector Component", () => {
  it("should render Indonesian and English language option buttons with flags", () => {
    renderWithProviders(<LanguageSelector />);

    expect(screen.getByRole("button", { name: /🇮🇩 Indonesia Bahasa Indonesia/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /🇬🇧 English English/i })).toBeInTheDocument();
  });

  it("should call i18n.changeLanguage when selecting a language button", () => {
    renderWithProviders(<LanguageSelector />);

    const englishBtn = screen.getByRole("button", { name: /🇬🇧 English English/i });
    fireEvent.click(englishBtn);

    expect(i18n.changeLanguage).toHaveBeenCalledWith("en");
  });
});
