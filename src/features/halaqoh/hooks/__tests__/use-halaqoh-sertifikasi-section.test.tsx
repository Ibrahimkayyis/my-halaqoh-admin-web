import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHalaqohSertifikasiSection } from "../use-halaqoh-detail";
import * as sertifikasiQueries from "@/lib/firestore/queries/sertifikasi.queries";
import type { Santri } from "@/features/santri/types/santri.types";
import type { SertifikasiTahfidz } from "@/features/sertifikasi/types/sertifikasi.types";
import { Timestamp } from "firebase/firestore";

vi.mock("@/lib/firestore/queries/sertifikasi.queries", () => ({
  subscribeSertifikasiByHalaqohId: vi.fn(),
}));

describe("useHalaqohSertifikasiSection Hook", () => {
  let mockCallback: ((docs: SertifikasiTahfidz[]) => void) | null = null;
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockCallback = null;
    vi.mocked(sertifikasiQueries.subscribeSertifikasiByHalaqohId).mockImplementation(
      (_id, onNext) => {
        mockCallback = onNext;
        return mockUnsubscribe;
      }
    );
  });

  const mockMembers: Santri[] = [
    {
      id: "santri-1",
      nama: "Achmad Xavier Bhagaskara",
      nis: "4100001458",
      kelas: "11",
      program: "R",
      isAlumni: false,
    } as Santri,
    {
      id: "santri-2",
      nama: "Alfin Syarif Ramadhan",
      nis: "4100001435",
      kelas: "11",
      program: "R",
      isAlumni: false,
    } as Santri,
  ];

  it("should deduplicate multiple passed certification records for the same Juz", () => {
    const { result } = renderHook(() =>
      useHalaqohSertifikasiSection("h1", mockMembers)
    );

    expect(result.current.isLoading).toBe(true);

    // Simulate Firestore emission with 2 passed records for Juz 30 for santri-1 (like user's bug report)
    const mockDocs: SertifikasiTahfidz[] = [
      {
        id: "cert-1",
        santriId: "santri-1",
        santriNama: "Achmad Xavier Bhagaskara",
        nis: "4100001458",
        kelas: "11",
        program: "R",
        halaqohId: "h1",
        halaqohNama: "Halaqoh A",
        guruId: "g1",
        guruNama: "Ustadz A",
        juz: 30,
        status: "passed",
        nilai: 85,
        createdAt: Timestamp.fromMillis(1000),
        updatedAt: Timestamp.fromMillis(1000),
      },
      {
        id: "cert-2",
        santriId: "santri-1",
        santriNama: "Achmad Xavier Bhagaskara",
        nis: "4100001458",
        kelas: "11",
        program: "R",
        halaqohId: "h1",
        halaqohNama: "Halaqoh A",
        guruId: "g1",
        guruNama: "Ustadz A",
        juz: 30,
        status: "passed",
        nilai: 92, // higher score
        createdAt: Timestamp.fromMillis(2000),
        updatedAt: Timestamp.fromMillis(2000),
      },
      {
        id: "cert-3",
        santriId: "santri-1",
        santriNama: "Achmad Xavier Bhagaskara",
        nis: "4100001458",
        kelas: "11",
        program: "R",
        halaqohId: "h1",
        halaqohNama: "Halaqoh A",
        guruId: "g1",
        guruNama: "Ustadz A",
        juz: 29,
        status: "passed",
        nilai: 90,
        createdAt: Timestamp.fromMillis(3000),
        updatedAt: Timestamp.fromMillis(3000),
      },
    ];

    act(() => {
      mockCallback?.(mockDocs);
    });

    expect(result.current.isLoading).toBe(false);

    const entries = result.current.sertifikasiEntries;
    expect(entries).toHaveLength(2);

    // Santri 1 (Achmad Xavier) should have exactly 2 unique certified juz (Juz 29 and Juz 30), NOT 3!
    const achmad = entries[0];
    expect(achmad.santriNama).toBe("Achmad Xavier Bhagaskara");
    expect(achmad.passedItems).toHaveLength(2);
    expect(achmad.certifiedJuzNumbers).toEqual([29, 30]);
    expect(achmad.certifiedCount).toBe(2);

    // Record for Juz 30 must be cert-2 (nilai: 92), not cert-1
    const juz30Cert = achmad.passedItems.find((p) => p.juz === 30);
    expect(juz30Cert?.id).toBe("cert-2");
    expect(juz30Cert?.nilai).toBe(92);

    // Santri 2 (Alfin) has no passed items
    const alfin = entries[1];
    expect(alfin.passedItems).toHaveLength(0);
    expect(alfin.certifiedCount).toBe(0);

    // Summary stats
    expect(result.current.totalCertifiedJuz).toBe(2);
    expect(result.current.santriWithCertification).toBe(1);
  });
});
