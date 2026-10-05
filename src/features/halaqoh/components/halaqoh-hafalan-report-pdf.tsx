/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type {
  HalaqohHafalanReportData,
  SantriHafalanReportEntry,
} from "../types/halaqoh-hafalan-report.types";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 36,
    paddingTop: 32,
    paddingBottom: 40,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },

  // ── Letterhead Header ──────────────────────────────────────────
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.2,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 38,
    height: 38,
    objectFit: "contain",
  },
  headerTitles: {
    flexDirection: "column",
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#115D69",
    letterSpacing: 0.3,
  },
  reportSubtitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  periodPill: {
    backgroundColor: "#E8F4F6",
    color: "#0C424B",
    fontSize: 8,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 3,
  },
  printedDate: {
    fontSize: 7,
    color: "#64748B",
  },

  // ── Halaqoh Identity Strip (4 Columns) ─────────────────────────
  identityStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 0.8,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 12,
  },
  identityCol: {
    flex: 1,
    flexDirection: "column",
  },
  identityDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
  },
  identityLabel: {
    fontSize: 6.5,
    color: "#94A3B8",
    fontWeight: "bold",
    letterSpacing: 0.3,
    marginBottom: 1.5,
  },
  identityValue: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#0F172A",
  },

  // ── Santri Container ───────────────────────────────────────────
  santriContainer: {
    marginBottom: 14,
  },

  // ── Compact Student Header ─────────────────────────────────────
  studentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  studentNameLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  studentAccentBar: {
    width: 3,
    height: 12,
    backgroundColor: "#115D69",
    borderRadius: 1.5,
  },
  studentNameText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0F172A",
  },
  studentNisPill: {
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#64748B",
  },

  // ── Metric Cards Grid (4 Cards) ────────────────────────────────
  metricsGrid: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  metricCard: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: {
    fontSize: 6.5,
    color: "#64748B",
    fontWeight: "bold",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 11,
    fontWeight: "bold",
  },

  // ── Setoran Table ──────────────────────────────────────────────
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  thRow: {
    flexDirection: "row",
    backgroundColor: "#115D69",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  thCell: {
    color: "#FFFFFF",
    fontSize: 6.5,
    fontWeight: "bold",
    textAlign: "center",
  },
  tr: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E8F0",
    minHeight: 18,
    alignItems: "center",
    paddingVertical: 2.5,
    paddingHorizontal: 4,
  },
  trSubRow: {
    borderBottomColor: "#F1F5F9",
  },
  trEven: {
    backgroundColor: "#FFFFFF",
  },
  trOdd: {
    backgroundColor: "#F8FAFC",
  },
  tdCell: {
    fontSize: 7,
    color: "#0F172A",
    textAlign: "center",
  },
  tdSurahCell: {
    fontSize: 7,
    color: "#0F172A",
    textAlign: "left",
    paddingLeft: 4,
  },

  // Columns Widths
  colTgl: { width: 42, textAlign: "center" },
  colHari: { width: 28, textAlign: "center" },
  colJenis: { width: 54, textAlign: "center" },
  colSurah: { flex: 1, textAlign: "left", paddingLeft: 4 },
  colJuz: { width: 26, textAlign: "center" },
  colLancar: { width: 48, textAlign: "center" },
  colTajwid: { width: 48, textAlign: "center" },
  colPredikat: { width: 48, textAlign: "center" },

  // Badges
  badgeZiyadah: {
    backgroundColor: "#ECFDF5",
    color: "#10B981",
    fontSize: 6.5,
    fontWeight: "bold",
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "#A7F3D0",
  },
  badgeMurajaah: {
    backgroundColor: "#EFF6FF",
    color: "#3B82F6",
    fontSize: 6.5,
    fontWeight: "bold",
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "#BFDBFE",
  },
  scoreBadge: {
    fontSize: 6.5,
    fontWeight: "bold",
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    borderRadius: 2,
    borderWidth: 0.5,
  },
  scoreMumtaz: {
    backgroundColor: "#ECFDF5",
    color: "#10B981",
    borderColor: "#A7F3D0",
  },
  scoreJayyid: {
    backgroundColor: "#FFFBEB",
    color: "#D97706",
    borderColor: "#FDE68A",
  },
  scoreMaqbul: {
    backgroundColor: "#FFF7ED",
    color: "#EA580C",
    borderColor: "#FED7AA",
  },

  // Empty State Container
  emptyBox: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 7.5,
    color: "#64748B",
  },

  // Legend Box
  legendBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 10,
  },
  legendItemsGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  legendText: {
    fontSize: 6.5,
    color: "#64748B",
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 18,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#E2E8F0",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 6.5,
    color: "#94A3B8",
  },
});

const HARI_NAMES = ["Ahd", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function formatShortDate(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function getScoreStyle(score: number) {
  if (score >= 85) return styles.scoreMumtaz;
  if (score >= 70) return styles.scoreJayyid;
  return styles.scoreMaqbul;
}

interface HalaqohHafalanReportPDFProps {
  reportData: HalaqohHafalanReportData;
  logoUrl?: string;
}

function SantriReportSection({
  santriEntry,
  isFirst,
}: {
  santriEntry: SantriHafalanReportEntry;
  isFirst: boolean;
}) {
  const { totalZiyadah, totalMurajaah, avgScore, predikat, groups } = santriEntry;

  const gradeCardColor =
    avgScore === null
      ? { text: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" }
      : avgScore >= 85
      ? { text: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" }
      : avgScore >= 70
      ? { text: "#D97706", bg: "#FFFBEB", border: "#FDE68A" }
      : { text: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" };

  return (
    <View break={!isFirst} style={styles.santriContainer}>
      {/* Compact Student Header & 4 Metric Cards (Kept together) */}
      <View wrap={false}>
        <View style={styles.studentHeader}>
          <View style={styles.studentNameLeft}>
            <View style={styles.studentAccentBar} />
            <Text style={styles.studentNameText}>{santriEntry.nama}</Text>
          </View>
          <Text style={styles.studentNisPill}>NIS: {santriEntry.nis || "-"}</Text>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0" }]}>
            <Text style={styles.metricLabel}>ZIYADAH</Text>
            <Text style={[styles.metricValue, { color: "#10B981" }]}>{totalZiyadah}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: "#EFF6FF", borderColor: "#BFDBFE" }]}>
            <Text style={styles.metricLabel}>MURAJA&apos;AH</Text>
            <Text style={[styles.metricValue, { color: "#3B82F6" }]}>{totalMurajaah}</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: gradeCardColor.bg, borderColor: gradeCardColor.border }]}>
            <Text style={styles.metricLabel}>RATA-RATA NILAI</Text>
            <Text style={[styles.metricValue, { color: gradeCardColor.text }]}>
              {avgScore !== null ? avgScore : "-"}
            </Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: gradeCardColor.bg, borderColor: gradeCardColor.border }]}>
            <Text style={styles.metricLabel}>PREDIKAT</Text>
            <Text style={[styles.metricValue, { color: gradeCardColor.text, fontSize: 9.5 }]}>
              {predikat || "-"}
            </Text>
          </View>
        </View>
      </View>

      {/* Setoran Detail Table — Expands each multi-surah setoran into individual sub-rows */}
      {groups.length > 0 ? (
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.thRow}>
            <Text style={[styles.thCell, styles.colTgl]}>Tgl</Text>
            <Text style={[styles.thCell, styles.colHari]}>Hari</Text>
            <Text style={[styles.thCell, styles.colJenis]}>Jenis</Text>
            <Text style={[styles.thCell, styles.colSurah]}>Surah & Ayat</Text>
            <Text style={[styles.thCell, styles.colJuz]}>Juz</Text>
            <Text style={[styles.thCell, styles.colLancar]}>Kelancaran</Text>
            <Text style={[styles.thCell, styles.colTajwid]}>Tajwid</Text>
            <Text style={[styles.thCell, styles.colPredikat]}>Predikat</Text>
          </View>

          {/* Data Rows */}
          {groups.map((group, groupIdx) => {
            const isZiyadah = group.jenis === "ziyadah";
            const groupPredikat =
              group.avgScore >= 85 ? "Mumtaz" : group.avgScore >= 70 ? "Jayyid" : "Maqbul";
            const bgStyle = groupIdx % 2 === 0 ? styles.trEven : styles.trOdd;
            const records = group.records;

            if (records.length === 0) return null;

            const firstRecord = records[0];

            return (
              <React.Fragment key={groupIdx}>
                {/* Main Row (First surah of this session) */}
                <View wrap={false} style={[styles.tr, bgStyle]}>
                  <Text style={[styles.tdCell, styles.colTgl]}>
                    {formatShortDate(group.tanggal)}
                  </Text>
                  <Text style={[styles.tdCell, styles.colHari]}>
                    {HARI_NAMES[group.tanggal.getDay()]}
                  </Text>
                  <View style={[styles.colJenis, { alignItems: "center" }]}>
                    <Text style={isZiyadah ? styles.badgeZiyadah : styles.badgeMurajaah}>
                      {isZiyadah ? "Ziyadah" : "Muraja'ah"}
                    </Text>
                  </View>
                  <Text style={[styles.tdSurahCell, styles.colSurah]}>
                    {firstRecord.surah} ({firstRecord.ayatMulai}-{firstRecord.ayatSelesai})
                  </Text>
                  <Text style={[styles.tdCell, styles.colJuz]}>
                    {firstRecord.juz}
                  </Text>
                  <View style={[styles.colLancar, { alignItems: "center" }]}>
                    <Text style={[styles.scoreBadge, getScoreStyle(group.nilaiKelancaran)]}>
                      {group.nilaiKelancaran}
                    </Text>
                  </View>
                  <View style={[styles.colTajwid, { alignItems: "center" }]}>
                    <Text style={[styles.scoreBadge, getScoreStyle(group.nilaiTajwid)]}>
                      {group.nilaiTajwid}
                    </Text>
                  </View>
                  <View style={[styles.colPredikat, { alignItems: "center" }]}>
                    <Text style={[styles.scoreBadge, getScoreStyle(group.avgScore)]}>
                      {groupPredikat}
                    </Text>
                  </View>
                </View>

                {/* Sub-rows for multi-surah setoran in the same session */}
                {records.slice(1).map((subRec, subIdx) => (
                  <View key={subIdx} wrap={false} style={[styles.tr, styles.trSubRow, bgStyle]}>
                    <Text style={[styles.tdCell, styles.colTgl]}></Text>
                    <Text style={[styles.tdCell, styles.colHari]}></Text>
                    <Text style={[styles.tdCell, styles.colJenis]}></Text>
                    <Text style={[styles.tdSurahCell, styles.colSurah]}>
                      {subRec.surah} ({subRec.ayatMulai}-{subRec.ayatSelesai})
                    </Text>
                    <Text style={[styles.tdCell, styles.colJuz]}>
                      {subRec.juz}
                    </Text>
                    <Text style={[styles.tdCell, styles.colLancar]}></Text>
                    <Text style={[styles.tdCell, styles.colTajwid]}></Text>
                    <Text style={[styles.tdCell, styles.colPredikat]}></Text>
                  </View>
                ))}
              </React.Fragment>
            );
          })}
        </View>
      ) : (
        <View wrap={false} style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Tidak ada data setoran hafalan pada periode ini.
          </Text>
        </View>
      )}

      {/* Legend Box */}
      <View wrap={false} style={styles.legendBox}>
        <View style={styles.legendItemsGroup}>
          <View style={styles.legendItem}>
            <Text style={styles.badgeZiyadah}>Ziyadah</Text>
            <Text style={styles.legendText}>Setoran Baru</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={styles.badgeMurajaah}>Muraja&apos;ah</Text>
            <Text style={styles.legendText}>Mengulang</Text>
          </View>
        </View>

        <View style={styles.legendItemsGroup}>
          <View style={styles.legendItem}>
            <Text style={[styles.scoreBadge, styles.scoreMumtaz]}>Mumtaz (≥85)</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.scoreBadge, styles.scoreJayyid]}>Jayyid (70–84)</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.scoreBadge, styles.scoreMaqbul]}>Maqbul (&lt;70)</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export function HalaqohHafalanReportPDF({
  reportData,
  logoUrl = "/images/my_halaqoh_logo_new.png",
}: HalaqohHafalanReportPDFProps) {
  const isTakhassus = reportData.program === "T";

  const printFmt = reportData.generatedAt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const startFmt = reportData.startDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const endFmt = reportData.endDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const periodText =
    reportData.periodLabel || `${startFmt.toUpperCase()} – ${endFmt.toUpperCase()}`;

  const santriList = reportData.santriEntries;

  return (
    <Document title={`Laporan_Hafalan_Halaqoh_${reportData.halaqohNama}`}>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Letterhead Header (Top of Document) */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
            <View style={styles.headerTitles}>
              <Text style={styles.brandTitle}>MyHalaqoh</Text>
              <Text style={styles.reportSubtitle}>Rekapitulasi Capaian Hafalan Halaqoh</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.periodPill}>{periodText.toUpperCase()}</Text>
            <Text style={styles.printedDate}>Dicetak pada: {printFmt}</Text>
          </View>
        </View>

        {/* Global Halaqoh Identity Strip (4 Columns) */}
        <View style={styles.identityStrip}>
          <View style={styles.identityCol}>
            <Text style={styles.identityLabel}>HALAQOH</Text>
            <Text style={styles.identityValue}>{reportData.halaqohNama}</Text>
          </View>
          <View style={styles.identityDivider} />
          <View style={styles.identityCol}>
            <Text style={styles.identityLabel}>PEMBIMBING</Text>
            <Text style={styles.identityValue}>{reportData.guruNama || "-"}</Text>
          </View>
          <View style={styles.identityDivider} />
          <View style={styles.identityCol}>
            <Text style={styles.identityLabel}>KELAS & PROGRAM</Text>
            <Text style={styles.identityValue}>
              Kelas {reportData.kelas} • {isTakhassus ? "Takhassus" : "Reguler"}
            </Text>
          </View>
          <View style={styles.identityDivider} />
          <View style={styles.identityCol}>
            <Text style={styles.identityLabel}>TOTAL SANTRI</Text>
            <Text style={styles.identityValue}>{santriList.length} Santri</Text>
          </View>
        </View>

        {/* All Santri Sections */}
        {santriList.length > 0 ? (
          santriList.map((santriEntry, idx) => (
            <SantriReportSection
              key={santriEntry.santriId}
              santriEntry={santriEntry}
              isFirst={idx === 0}
            />
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>Belum ada anggota santri di halaqoh ini.</Text>
          </View>
        )}

        {/* Footer (Fixed on all pages) */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            MyHalaqoh • {reportData.halaqohNama}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Halaman ${pageNumber} dari ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
