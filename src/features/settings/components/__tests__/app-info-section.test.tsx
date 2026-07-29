import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { AppInfoSection } from "../app-info-section";
import { APP_CONFIG } from "@/lib/constants/app";

describe("AppInfoSection Component", () => {
  it("should render application name, tagline, and version badge", () => {
    renderWithProviders(<AppInfoSection />);

    expect(screen.getAllByText(APP_CONFIG.name).length).toBeGreaterThan(0);
    expect(screen.getByText(APP_CONFIG.tagline)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`Versi ${APP_CONFIG.version}`, "i"))).toBeInTheDocument();
  });

  it("should render list of app features from APP_CONFIG", () => {
    renderWithProviders(<AppInfoSection />);

    APP_CONFIG.features.forEach((feature) => {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
    });
  });

  it("should render app info table details including platform and institution", () => {
    renderWithProviders(<AppInfoSection />);

    expect(screen.getByText(APP_CONFIG.platform)).toBeInTheDocument();
    expect(screen.getByText(APP_CONFIG.institution)).toBeInTheDocument();
  });

  it("should render WhatsApp contact admin links", () => {
    renderWithProviders(<AppInfoSection />);

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", expect.stringContaining("wa.me"));
  });
});
