import { describe, it, expect } from "vitest";
import { calculateProgramStats } from "../use-kehadiran-guru";
import type { Guru } from "@/features/guru/types/guru.types";
import type { Halaqoh } from "@/types/models/halaqoh.types";
import type { AbsensiRecord } from "../../types/kehadiran-guru.types";

const mockGuru = (id: string, nama: string, program: "R" | "T"): Guru => ({
  id,
  nip: `100000000000${id}`,
  nama,
  program,
  createdAt: { toDate: () => new Date() } as any,
  updatedAt: { toDate: () => new Date() } as any,
});

const mockHalaqoh = (id: string, guruId: string, program: "R" | "T"): Halaqoh => ({
  id,
  nama: `Halaqoh ${id}`,
  kelas: "7",
  program,
  guruId,
  guruNama: `Guru ${guruId}`,
  santriIds: [],
  jumlahSantri: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const mockAbsensi = (
  id: string,
  guruId: string,
  sesi: "shubuh" | "maghrib" | "dhuha",
  timeOffsetMins = 0
): AbsensiRecord => ({
  id,
  halaqohId: `hal-${guruId}`,
  guruId,
  tanggal: new Date("2026-08-03T05:00:00Z"),
  sesi: sesi as any,
  createdAt: new Date(new Date("2026-08-03T05:00:00Z").getTime() + timeOffsetMins * 60000),
});

describe("calculateProgramStats Scenarios & Donut Chart Impact", () => {
  it("Scenario 1: All teachers active (100% active, 0% inactive)", () => {
    const gurus = [mockGuru("g1", "Guru A", "R"), mockGuru("g2", "Guru B", "R")];
    const halaqohs = [mockHalaqoh("h1", "g1", "R"), mockHalaqoh("h2", "g2", "R")];
    const absensi = [mockAbsensi("a1", "g1", "shubuh"), mockAbsensi("a2", "g2", "shubuh")];

    const { summary, guruList } = calculateProgramStats("R", gurus, halaqohs, absensi, "shubuh");

    expect(summary.totalGuru).toBe(2);
    expect(summary.totalWithHalaqoh).toBe(2);
    expect(summary.activeCount).toBe(2);
    expect(summary.inactiveCount).toBe(0);
    expect(summary.noHalaqohCount).toBe(0);
    expect(summary.activePercentage).toBe(100);

    expect(guruList).toHaveLength(2);
    expect(guruList.every((g) => g.status === "active")).toBe(true);
  });

  it("Scenario 2: All teachers inactive (0% active, 100% inactive)", () => {
    const gurus = [mockGuru("g1", "Guru A", "R"), mockGuru("g2", "Guru B", "R")];
    const halaqohs = [mockHalaqoh("h1", "g1", "R"), mockHalaqoh("h2", "g2", "R")];
    const absensi: AbsensiRecord[] = [];

    const { summary, guruList } = calculateProgramStats("R", gurus, halaqohs, absensi, "shubuh");

    expect(summary.totalGuru).toBe(2);
    expect(summary.activeCount).toBe(0);
    expect(summary.inactiveCount).toBe(2);
    expect(summary.activePercentage).toBe(0);

    expect(guruList).toHaveLength(2);
    expect(guruList.every((g) => g.status === "inactive")).toBe(true);
  });

  it("Scenario 3: Mixed active and inactive teachers (e.g. 60% active, 40% inactive)", () => {
    const gurus = [
      mockGuru("g1", "Guru A", "R"),
      mockGuru("g2", "Guru B", "R"),
      mockGuru("g3", "Guru C", "R"),
      mockGuru("g4", "Guru D", "R"),
      mockGuru("g5", "Guru E", "R"),
    ];
    const halaqohs = gurus.map((g) => mockHalaqoh(`h-${g.id}`, g.id, "R"));
    const absensi = [
      mockAbsensi("a1", "g1", "shubuh"),
      mockAbsensi("a2", "g2", "shubuh"),
      mockAbsensi("a3", "g3", "shubuh"),
    ];

    const { summary, guruList } = calculateProgramStats("R", gurus, halaqohs, absensi, "shubuh");

    expect(summary.totalGuru).toBe(5);
    expect(summary.activeCount).toBe(3);
    expect(summary.inactiveCount).toBe(2);
    expect(summary.activePercentage).toBe(60);

    // Verify status sorting: active first, then inactive
    expect(guruList[0].status).toBe("active");
    expect(guruList[1].status).toBe("active");
    expect(guruList[2].status).toBe("active");
    expect(guruList[3].status).toBe("inactive");
    expect(guruList[4].status).toBe("inactive");
  });

  it("Scenario 4: All teachers without halaqoh", () => {
    const gurus = [mockGuru("g1", "Guru A", "R"), mockGuru("g2", "Guru B", "R")];
    const halaqohs: Halaqoh[] = [];
    const absensi: AbsensiRecord[] = [];

    const { summary, guruList } = calculateProgramStats("R", gurus, halaqohs, absensi, "shubuh");

    expect(summary.totalGuru).toBe(2);
    expect(summary.totalWithHalaqoh).toBe(0);
    expect(summary.activeCount).toBe(0);
    expect(summary.inactiveCount).toBe(0);
    expect(summary.noHalaqohCount).toBe(2);
    expect(summary.activePercentage).toBe(0); // 0/0 edge case handles safely without NaN

    expect(guruList.every((g) => g.status === "no-halaqoh")).toBe(true);
  });

  it("Scenario 5: Mixed active, inactive, and no-halaqoh teachers", () => {
    const gurus = [
      mockGuru("g1", "Guru A", "R"),
      mockGuru("g2", "Guru B", "R"),
      mockGuru("g3", "Guru C", "R"),
      mockGuru("g4", "Guru D", "R"),
    ];
    // g1, g2, g3 have halaqoh; g4 does not
    const halaqohs = [
      mockHalaqoh("h1", "g1", "R"),
      mockHalaqoh("h2", "g2", "R"),
      mockHalaqoh("h3", "g3", "R"),
    ];
    // g1 submitted absensi
    const absensi = [mockAbsensi("a1", "g1", "shubuh")];

    const { summary, guruList } = calculateProgramStats("R", gurus, halaqohs, absensi, "shubuh");

    expect(summary.totalGuru).toBe(4);
    expect(summary.totalWithHalaqoh).toBe(3);
    expect(summary.activeCount).toBe(1);
    expect(summary.inactiveCount).toBe(2);
    expect(summary.noHalaqohCount).toBe(1);
    expect(summary.activePercentage).toBe(33); // Math.round(1/3 * 100) = 33%

    // Order: active (g1) -> inactive (g2, g3) -> no-halaqoh (g4)
    expect(guruList[0].guruId).toBe("g1");
    expect(guruList[0].status).toBe("active");
    expect(guruList[3].guruId).toBe("g4");
    expect(guruList[3].status).toBe("no-halaqoh");
  });

  it("Scenario 6: Program has no teachers", () => {
    const gurus: Guru[] = [];
    const halaqohs: Halaqoh[] = [];
    const absensi: AbsensiRecord[] = [];

    const { summary, guruList } = calculateProgramStats("R", gurus, halaqohs, absensi, "shubuh");

    expect(summary.totalGuru).toBe(0);
    expect(summary.totalWithHalaqoh).toBe(0);
    expect(summary.activeCount).toBe(0);
    expect(summary.inactiveCount).toBe(0);
    expect(summary.activePercentage).toBe(0);
    expect(guruList).toHaveLength(0);
  });

  it("Scenario 7: Single teacher program (active)", () => {
    const gurus = [mockGuru("g1", "Solo Guru", "T")];
    const halaqohs = [mockHalaqoh("h1", "g1", "T")];
    const absensi = [mockAbsensi("a1", "g1", "dhuha")];

    const { summary } = calculateProgramStats("T", gurus, halaqohs, absensi, "dhuha");

    expect(summary.totalGuru).toBe(1);
    expect(summary.activeCount).toBe(1);
    expect(summary.activePercentage).toBe(100);
  });

  it("Scenario 8: Single teacher program (inactive)", () => {
    const gurus = [mockGuru("g1", "Solo Guru", "T")];
    const halaqohs = [mockHalaqoh("h1", "g1", "T")];
    const absensi: AbsensiRecord[] = [];

    const { summary } = calculateProgramStats("T", gurus, halaqohs, absensi, "dhuha");

    expect(summary.totalGuru).toBe(1);
    expect(summary.activeCount).toBe(0);
    expect(summary.inactiveCount).toBe(1);
    expect(summary.activePercentage).toBe(0);
  });

  it("Scenario 9: Duplicate absensi records for same teacher in same session", () => {
    const gurus = [mockGuru("g1", "Guru A", "R")];
    const halaqohs = [mockHalaqoh("h1", "g1", "R")];
    const absensi = [
      mockAbsensi("a1", "g1", "shubuh", 5),
      mockAbsensi("a2", "g1", "shubuh", 15),
    ];

    const { summary, guruList } = calculateProgramStats("R", gurus, halaqohs, absensi, "shubuh");

    expect(summary.totalGuru).toBe(1);
    expect(summary.activeCount).toBe(1);
    expect(guruList[0].absensiTime).toEqual(absensi[1].createdAt);
  });

  it("Scenario 10: Absensi submitted for different session is not counted for current session", () => {
    const gurus = [mockGuru("g1", "Guru A", "R")];
    const halaqohs = [mockHalaqoh("h1", "g1", "R")];
    const absensi = [mockAbsensi("a1", "g1", "maghrib")];

    const { summary, guruList } = calculateProgramStats("R", gurus, halaqohs, absensi, "shubuh");

    expect(summary.activeCount).toBe(0);
    expect(summary.inactiveCount).toBe(1);
    expect(guruList[0].status).toBe("inactive");
  });
});
