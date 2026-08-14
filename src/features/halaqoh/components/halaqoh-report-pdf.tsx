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
    padding: 30,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  pageLandscape: {
    padding: 30,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },

  // Header Box
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1.5,
    borderBottomColor: "#0f766e",
    paddingBottom: 8,
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 44,
    height: 44,
  },
  headerTitles: {
    flexDirection: "column",
  },
  institutionName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f766e",
    letterSpacing: 0.5,
  },
  reportTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  periodBadge: {
    backgroundColor: "#ccfbf1",
    color: "#0f766e",
    fontSize: 7.5,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 3,
  },
  printedDate: {
    fontSize: 6.5,
    color: "#64748b",
  },

  // Meta Info Card
  metaCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "column",
  },
  metaLabel: {
    fontSize: 6.5,
    color: "#64748b",
    fontWeight: "bold",
    marginBottom: 1,
  },
  metaValue: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#0f172a",
  },

  // Section Header
  blockTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0f766e",
    backgroundColor: "#f0fdf4",
    borderLeftWidth: 3,
    borderLeftColor: "#0f766e",
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginBottom: 6,
    marginTop: 4,
  },

  // Multi-level Merged Header Table
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    marginBottom: 12,
  },
  // Table Header Row 1
  thRow1: {
    flexDirection: "row",
    backgroundColor: "#0f766e",
    borderBottomWidth: 1,
    borderBottomColor: "#0d9488",
  },
  // Table Header Row 2
  thRow2: {
    flexDirection: "row",
    backgroundColor: "#115e59",
    borderBottomWidth: 1,
    borderBottomColor: "#0f766e",
  },
  // Table Header Row 3
  thRow3: {
    flexDirection: "row",
    backgroundColor: "#134e4a",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },

  thCell: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 7,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 3,
  },

  // Table Body Rows
  tr: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 18,
    alignItems: "center",
  },
  trEven: {
    backgroundColor: "#ffffff",
  },
  trOdd: {
    backgroundColor: "#f8fafc",
  },

  tdCell: {
    fontSize: 7.5,
    paddingVertical: 3,
    paddingHorizontal: 4,
    justifyContent: "center",
  },

  // Column Width Definitions (Portrait / Landscape)
  colNo: { width: "6%", textAlign: "center" },
  colNama: { width: "42%", textAlign: "left" },
  colMax: { width: "13%", textAlign: "center" },
  colHdr: { width: "13%", textAlign: "center", fontWeight: "bold", color: "#047857" },
  colSkt: { width: "8.66%", textAlign: "center", color: "#d97706" },
  colIzn: { width: "8.66%", textAlign: "center", color: "#2563eb" },
  colAlp: { width: "8.66%", textAlign: "center", color: "#dc2626" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 6.5,
    color: "#94a3b8",
  },
});

interface AbsenceReportPDFProps {
  reportData: HalaqohReportData;
  logoUrl?: string;
}

export function AbsenceReportPDF({ reportData, logoUrl }: AbsenceReportPDFProps) {
  const isTakhassus = reportData.program === "T";
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
  const printFmt = reportData.generatedAt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Document title={`Laporan_Absensi_Halaqoh_${reportData.halaqohNama}`}>
      <Page
        size="A4"
        orientation={isTakhassus ? "landscape" : "portrait"}
        style={isTakhassus ? styles.pageLandscape : styles.pagePortrait}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
            <View style={styles.headerTitles}>
              <Text style={styles.institutionName}>PESANTREN LUQMAN AL HAKIM</Text>
              <Text style={styles.reportTitle}>REKAPITULASI PRESENSI HALAQOH</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.periodBadge}>
              PERIODE: {startFmt.toUpperCase()} – {endFmt.toUpperCase()}
            </Text>
            <Text style={styles.printedDate}>Dicetak pada: {printFmt}</Text>
          </View>
        </View>

        {/* Metadata Card */}
        <View style={styles.metaCard}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>NAMA HALAQOH</Text>
            <Text style={styles.metaValue}>{reportData.halaqohNama}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>USTADZ PEMBIMBING</Text>
            <Text style={styles.metaValue}>{reportData.guruNama || "-"}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>KELAS & PROGRAM</Text>
            <Text style={styles.metaValue}>
              Kelas {reportData.kelas} • Program {isTakhassus ? "Takhassus" : "Reguler"}
            </Text>
          </View>
        </View>

        {/* Weekly Report Tables */}
        {reportData.weeklyBlocks.map((block, blockIdx) => (
          <View key={blockIdx} wrap={false}>
            <Text style={styles.blockTitle}>{block.weekLabel}</Text>

            <View style={styles.table}>
              {/* Multi-Level Merged Table Header */}
              {/* Header Row 1 */}
              <View style={styles.thRow1}>
                <Text style={[styles.thCell, styles.colNo]}>No.</Text>
                <Text style={[styles.thCell, styles.colNama]}>Nama Santri</Text>
                <Text style={[styles.thCell, { width: "52%" }]}>Kehadiran</Text>
              </View>

              {/* Header Row 2 */}
              <View style={styles.thRow2}>
                <Text style={[styles.thCell, styles.colNo]}></Text>
                <Text style={[styles.thCell, styles.colNama]}></Text>
                <Text style={[styles.thCell, { width: "26%" }]}>Halaqoh</Text>
                <Text style={[styles.thCell, { width: "26%" }]}>Keterangan Absence</Text>
              </View>

              {/* Header Row 3 */}
              <View style={styles.thRow3}>
                <Text style={[styles.thCell, styles.colNo]}></Text>
                <Text style={[styles.thCell, styles.colNama]}></Text>
                <Text style={[styles.thCell, styles.colMax]}>Max</Text>
                <Text style={[styles.thCell, styles.colHdr]}>Hdr</Text>
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
                      {s.sakitCount > 0 ? s.sakitCount : ""}
                    </Text>
                    <Text style={[styles.tdCell, styles.colIzn]}>
                      {s.izinCount > 0 ? s.izinCount : ""}
                    </Text>
                    <Text style={[styles.tdCell, styles.colAlp]}>
                      {s.alfaCount > 0 ? s.alfaCount : ""}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.tr}>
                  <Text style={[styles.tdCell, { width: "100%", textAlign: "center", color: "#94a3b8" }]}>
                    Belum ada anggota santri terdaftar
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            MyHalaqoh • Sistem Manajemen Halaqoh Pesantren Luqman Al Hakim
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
