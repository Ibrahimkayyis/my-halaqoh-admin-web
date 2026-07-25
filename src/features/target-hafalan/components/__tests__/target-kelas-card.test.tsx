import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { TargetKelasCard } from "../target-kelas-card";
import { CURRICULUM_REGULER } from "../../data/curriculum-data";

describe("TargetKelasCard Component", () => {
  const sampleCurriculum = CURRICULUM_REGULER[0]; // Class 7 Reguler

  it("should render class number badge and class label", () => {
    renderWithProviders(
      <TargetKelasCard
        curriculum={sampleCurriculum}
        tahunAjaran="2026/2027"
        semesterAktif={1}
      />
    );

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText(/Class 7|Kelas 7/i)).toBeInTheDocument();
  });

  it("should display active academic year and active semester badge when set", () => {
    renderWithProviders(
      <TargetKelasCard
        curriculum={sampleCurriculum}
        tahunAjaran="2026/2027"
        semesterAktif={1}
      />
    );

    expect(screen.getByText(/TA 2026\/2027/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Semester 1/i).length).toBeGreaterThan(0);
  });

  it("should display 'Not Set' when academic year or active semester is null", () => {
    renderWithProviders(
      <TargetKelasCard
        curriculum={sampleCurriculum}
        tahunAjaran={null}
        semesterAktif={null}
      />
    );

    expect(screen.getAllByText(/Not Set|Belum di-set/i).length).toBeGreaterThan(0);
  });

  it("should render UTS and UAS curriculum items for both semester 1 and 2", () => {
    renderWithProviders(
      <TargetKelasCard
        curriculum={sampleCurriculum}
        tahunAjaran="2026/2027"
        semesterAktif={2}
      />
    );

    expect(screen.getAllByText("UTS").length).toBe(2);
    expect(screen.getAllByText("UAS").length).toBe(2);
    expect(screen.getAllByText("I'dad Tahsin").length).toBe(2);
    expect(screen.getByText("An-Naba' – Al-A'la")).toBeInTheDocument();
    expect(screen.getByText("Al-Ghasyiyah – An-Nas")).toBeInTheDocument();
  });
});
