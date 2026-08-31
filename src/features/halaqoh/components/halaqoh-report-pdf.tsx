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
import type { HalaqohReportData } from "../types/halaqoh-report.types";

const styles = StyleSheet.create({
  pagePortrait: {
    paddingHorizontal: 36,
    paddingTop: 32,
    paddingBottom: 40,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },
  pageLandscape: {
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

  // ── Section Title ──────────────────────────────────────────────
  blockHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 8,
    gap: 6,
  },
  blockAccent: {
    width: 3,
    height: 12,
    backgroundColor: "#115D69",
    borderRadius: 1.5,
  },
  blockTitleText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0F172A",
  },

  // ── Table ──────────────────────────────────────────────────────
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  // Table Header Row 1
  thRow1: {
    flexDirection: "row",
    backgroundColor: "#115D69",
    borderBottomWidth: 0.5,
    borderBottomColor: "#0D4E58",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  // Table Header Row 2
  thRow2: {
    flexDirection: "row",
    backgroundColor: "#0C424B",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  thCell: {
    color: "#FFFFFF",
    fontSize: 6.5,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Table Body Rows
  tr: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E8F0",
    minHeight: 18,
    alignItems: "center",
    paddingVertical: 2.5,
    paddingHorizontal: 4,
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

  // Column Widths
  colNo: { width: "6%", textAlign: "center" },
  colNama: { width: "44%", textAlign: "left", paddingLeft: 4 },
  colMax: { width: "12.5%", textAlign: "center" },
  colHdr: { width: "12.5%", textAlign: "center", fontWeight: "bold", color: "#10B981" },
  colSkt: { width: "8.33%", textAlign: "center", color: "#D97706" },
  colIzn: { width: "8.33%", textAlign: "center", color: "#3B82F6" },
  colAlp: { width: "8.33%", textAlign: "center", color: "#EF4444" },

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
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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

interface AbsenceReportPDFProps {
  reportData: HalaqohReportData;
  logoUrl?: string;
}

export function AbsenceReportPDF({
  reportData,
  logoUrl = "/images/my_halaqoh_logo_new.png",
}: AbsenceReportPDFProps) {
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

  const totalSantri =
    reportData.weeklyBlocks[0]?.santriSummaries.length ?? 0;

  return (
    <Document title={`Laporan_Absensi_Halaqoh_${reportData.halaqohNama}`}>
      <Page
        size="A4"
        orientation={isTakhassus ? "landscape" : "portrait"}
        style={isTakhassus ? styles.pageLandscape : styles.pagePortrait}
      >
        {/* Letterhead Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
            <View style={styles.headerTitles}>
              <Text style={styles.brandTitle}>MyHalaqoh</Text>
              <Text style={styles.reportSubtitle}>Rekapitulasi Presensi Halaqoh</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.periodPill}>{periodText.toUpperCase()}</Text>
            <Text style={styles.printedDate}>Dicetak pada: {printFmt}</Text>
          </View>
        </View>

        {/* Halaqoh Identity Strip (4 Columns) */}
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
            <Text style={styles.identityValue}>{totalSantri} Santri</Text>
          </View>
        </View>

        {/* Table Block (Consolidated or Weekly) */}
        {reportData.weeklyBlocks.map((block, blockIdx) => (
          <View key={blockIdx} wrap={false}>
            {/* Section Header */}
            <View style={styles.blockHeader}>
              <View style={styles.blockAccent} />
              <Text style={styles.blockTitleText}>{block.weekLabel}</Text>
            </View>

            <View style={styles.table}>
              {/* Header Row 1 */}
              <View style={styles.thRow1}>
                <Text style={[styles.thCell, styles.colNo]}>No.</Text>
                <Text style={[styles.thCell, styles.colNama]}>Nama Santri</Text>
                <Text style={[styles.thCell, { width: "25%" }]}>Sesi Halaqoh</Text>
                <Text style={[styles.thCell, { width: "25%" }]}>Keterangan Ketidakhadiran</Text>
              </View>

              {/* Header Row 2 */}
              <View style={styles.thRow2}>
                <Text style={[styles.thCell, styles.colNo]}></Text>
                <Text style={[styles.thCell, styles.colNama]}></Text>
                <Text style={[styles.thCell, styles.colMax]}>Max</Text>
                <Text style={[styles.thCell, styles.colHdr]}>Hadir</Text>
                <Text style={[styles.thCell, styles.colSkt]}>Sakit</Text>
                <Text style={[styles.thCell, styles.colIzn]}>Izin</Text>
                <Text style={[styles.thCell, styles.colAlp]}>Alpa</Text>
              </View>

              {/* Data Rows */}
              {block.santriSummaries.length > 0 ? (
                block.santriSummaries.map((s, idx) => (
                  <View
                    key={s.santriId}
                    style={[styles.tr, idx % 2 === 0 ? styles.trEven : styles.trOdd]}
                  >
                    <Text style={[styles.tdCell, styles.colNo]}>{idx + 1}</Text>
                    <Text style={[styles.tdCell, styles.colNama]}>{s.nama}</Text>
                    <Text style={[styles.tdCell, styles.colMax]}>{s.maxSessions}</Text>
                    <Text style={[styles.tdCell, styles.colHdr]}>{s.hadirCount}</Text>
                    <Text style={[styles.tdCell, styles.colSkt]}>
                      {s.sakitCount > 0 ? s.sakitCount : "-"}
                    </Text>
                    <Text style={[styles.tdCell, styles.colIzn]}>
                      {s.izinCount > 0 ? s.izinCount : "-"}
                    </Text>
                    <Text style={[styles.tdCell, styles.colAlp]}>
                      {s.alfaCount > 0 ? s.alfaCount : "-"}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.tr}>
                  <Text
                    style={[
                      styles.tdCell,
                      { width: "100%", textAlign: "center", color: "#94A3B8" },
                    ]}
                  >
                    Belum ada anggota santri terdaftar
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Legend Box */}
        <View style={styles.legendBox}>
          <View style={styles.legendItemsGroup}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#10B981" }]} />
              <Text style={styles.legendText}>Hadir (H)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#D97706" }]} />
              <Text style={styles.legendText}>Sakit (S)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#3B82F6" }]} />
              <Text style={styles.legendText}>Izin (I)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: "#EF4444" }]} />
              <Text style={styles.legendText}>Alpa (A)</Text>
            </View>
          </View>

          <Text style={styles.legendText}>
            Max = Total sesi terjadwal pesantren pada periode
          </Text>
        </View>

        {/* Footer */}
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
