"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { AbsenceReportData } from "../types/absence-report.types";
import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";

Font.register({
  family: "Helvetica",
  fonts: [{ src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf" }],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 34,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  topAccentLine: {
    height: 3,
    backgroundColor: "#115D69",
    marginBottom: 10,
    borderRadius: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 44,
    height: 44,
    marginRight: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  pesantrenTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#115D69",
    letterSpacing: 0.4,
  },
  pesantrenSub: {
    fontSize: 7.5,
    color: "#64748b",
    marginTop: 2,
  },
  headerDividerThick: {
    height: 1.5,
    backgroundColor: "#115D69",
    marginTop: 6,
  },
  headerDividerThin: {
    height: 0.5,
    backgroundColor: "#cbd5e1",
    marginTop: 1.5,
    marginBottom: 10,
  },
  reportTitleBanner: {
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    borderWidth: 0.5,
    borderRadius: 4,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reportTitleText: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: "#115D69",
    letterSpacing: 0.2,
  },
  reportTitleSub: {
    fontSize: 7.5,
    color: "#047857",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaLabel: {
    fontWeight: "bold",
    color: "#64748b",
    fontSize: 8,
  },
  metaValue: {
    color: "#0f172a",
    fontSize: 8,
    fontWeight: "bold",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -6,
    marginBottom: 10,
  },
  legendText: {
    color: "#64748b",
    fontSize: 7.25,
  },

  // Day section
  daySection: {
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#115D69",
    color: "#ffffff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    fontSize: 8.5,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dayHeaderDate: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  dayHeaderCount: {
    color: "#e0f2fe",
    fontSize: 7.5,
  },

  allPresentText: {
    fontSize: 8,
    color: "#047857",
    paddingVertical: 5,
    paddingHorizontal: 9,
    backgroundColor: "#ecfdf5",
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "#a7f3d0",
    marginBottom: 2,
  },

  // Table
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: "#cbd5e1",
    borderRadius: 3,
    marginBottom: 4,
    overflow: "hidden",
  },
  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderBottomWidth: 0.75,
    borderBottomColor: "#cbd5e1",
    paddingVertical: 6,
  },
  headerCellText: {
    fontSize: 7.25,
    fontWeight: "bold",
    color: "#334155",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
    paddingVertical: 5.5,
    minHeight: 22,
  },
  tableRowEven: {
    backgroundColor: "#f8fafc",
  },

  // Table Columns
  colNo: {
    width: "4%",
    textAlign: "center",
    color: "#64748b",
    paddingHorizontal: 5,
    borderRightWidth: 0.5,
    borderRightColor: "#e5e9ef",
  },
  colNamaNis: {
    width: "23%",
    flexDirection: "column",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#e5e9ef",
  },
  namaText: {
    fontWeight: "bold",
    color: "#0f172a",
    fontSize: 8.5,
  },
  nisText: {
    color: "#94a3b8",
    fontSize: 7.25,
    marginTop: 2,
  },
  colKelas: {
    width: "6%",
    textAlign: "center",
    paddingHorizontal: 5,
    borderRightWidth: 0.5,
    borderRightColor: "#e5e9ef",
  },
  colHalaqoh: {
    width: "18%",
    color: "#334155",
    fontSize: 8,
    paddingHorizontal: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#e5e9ef",
  },
  colGuru: {
    width: "19%",
    color: "#334155",
    fontSize: 8,
    paddingHorizontal: 8,
    borderRightWidth: 0.5,
    borderRightColor: "#e5e9ef",
  },
  colSession: {
    width: "6%",
    textAlign: "center",
    paddingHorizontal: 3,
    borderRightWidth: 0.5,
    borderRightColor: "#e5e9ef",
  },
  colSessionLast: {
    width: "6%",
    textAlign: "center",
    paddingHorizontal: 3,
  },
  sessionCellSakit: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#d97706",
    backgroundColor: "#fef3c7",
    borderRadius: 2,
    paddingVertical: 2.5,
    paddingHorizontal: 3,
    textAlign: "center",
  },
  sessionCellIzin: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#2563eb",
    backgroundColor: "#eff6ff",
    borderRadius: 2,
    paddingVertical: 2.5,
    paddingHorizontal: 3,
    textAlign: "center",
  },
  sessionCellAlfa: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#e11d48",
    backgroundColor: "#ffe4e6",
    borderRadius: 2,
    paddingVertical: 2.5,
    paddingHorizontal: 3,
    textAlign: "center",
  },
  sessionCellEmpty: {
    fontSize: 8,
    color: "#cbd5e1",
    textAlign: "center",
  },

  // Daily summary
  dailySummaryBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    fontSize: 7.5,
    color: "#64748b",
    paddingTop: 2,
    paddingBottom: 3,
  },
  summaryPill: {
    backgroundColor: "#f8fafc",
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
    borderRadius: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },

  // Overall summary box
  overallBox: {
    marginTop: 12,
    padding: 9,
    backgroundColor: "#f8fafc",
    borderLeftWidth: 3.5,
    borderLeftColor: "#115D69",
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  overallTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#115D69",
    marginBottom: 7,
    letterSpacing: 0.3,
  },
  overallGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: "#e2e8f0",
    borderRadius: 3,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  statCardLabel: {
    fontSize: 6.5,
    color: "#64748b",
    marginBottom: 2,
  },
  statCardValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },
  valSakit: { color: "#d97706" },
  valIzin: { color: "#2563eb" },
  valAlfa: { color: "#e11d48" },

  // Footer page number
  footer: {
    position: "absolute",
    bottom: 12,
    left: 34,
    right: 34,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#94a3b8",
    borderTopWidth: 0.5,
    borderTopColor: "#f1f5f9",
    paddingTop: 4,
  },
});

interface AbsenceReportPDFProps {
  reportData: AbsenceReportData;
  logoUrl?: string;
}

export function AbsenceReportPDF({ reportData, logoUrl }: AbsenceReportPDFProps) {
  const { days, overallSummary } = reportData;

  const programLabel =
    overallSummary.programFilter === "R"
      ? "Program Reguler"
      : overallSummary.programFilter === "T"
        ? "Program Takhassus"
        : "Semua Program (Reguler & Takhassus)";

  const printDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Decorative Accent Line */}
        <View style={styles.topAccentLine} />

        {/* Document Header */}
        <View style={styles.headerContainer}>
          {logoUrl ? (
            /* eslint-disable-next-line jsx-a11y/alt-text */
            <Image src={logoUrl} style={styles.logo} />
          ) : null}
          <View style={styles.headerTextContainer}>
            <Text style={styles.pesantrenTitle}>PESANTREN LUQMAN AL HAKIM</Text>
            <Text style={styles.pesantrenSub}>
              Jl. Kejawan Putih Tambak VI No.1, Kec. Mulyorejo, Surabaya, Jawa Timur 60112
            </Text>
          </View>
        </View>

        {/* Double Header Line */}
        <View style={styles.headerDividerThick} />
        <View style={styles.headerDividerThin} />

        {/* Report Title Banner */}
        <View style={styles.reportTitleBanner}>
          <Text style={styles.reportTitleText}>LAPORAN KETIDAKHADIRAN SANTRI</Text>
          <Text style={styles.reportTitleSub}>Dokumen Resmi Admin Panel</Text>
        </View>

        {/* Metadata Filter Box */}
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Periode Laporan: </Text>
            <Text style={styles.metaValue}>
              {overallSummary.startDateStr} s/d {overallSummary.endDateStr}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Program: </Text>
            <Text style={styles.metaValue}>{programLabel}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Waktu Cetak: </Text>
            <Text style={styles.metaValue}>{printDate}</Text>
          </View>
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendText}>
            Kode status sesi: S = Sakit | I = Izin | A = Alfa | - = Tidak ada catatan ketidakhadiran
          </Text>
        </View>

        {/* Daily Sections */}
        {days.map((dayData) => (
          <View key={dayData.dateStr} style={styles.daySection}>
            {/* Day Header Bar */}
            <View style={styles.dayHeader}>
              <Text style={styles.dayHeaderDate}>{dayData.dateFormatted}</Text>
              <Text style={styles.dayHeaderCount}>
                {dayData.absentList.length > 0
                  ? `${dayData.absentList.length} Santri Tidak Hadir`
                  : "Semua Hadir"}
              </Text>
            </View>

            {dayData.absentList.length === 0 ? (
              <Text style={styles.allPresentText}>
                ✓ Semua santri hadir pada tanggal ini — tidak ada catatan ketidakhadiran.
              </Text>
            ) : (
              <>
                {/* Table */}
                <View style={styles.table}>
                  {/* Table Header */}
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.colNo, styles.headerCellText]}>No</Text>
                    <Text style={[styles.colNamaNis, styles.headerCellText]}>Nama Santri / NIS</Text>
                    <Text style={[styles.colKelas, styles.headerCellText]}>Kelas</Text>
                    <Text style={[styles.colHalaqoh, styles.headerCellText]}>Halaqoh</Text>
                    <Text style={[styles.colGuru, styles.headerCellText]}>Ustadz Pembimbing</Text>
                    <Text style={[styles.colSession, styles.headerCellText]}>Shubuh</Text>
                    <Text style={[styles.colSession, styles.headerCellText]}>Dhuha</Text>
                    <Text style={[styles.colSession, styles.headerCellText]}>Siang</Text>
                    <Text style={[styles.colSession, styles.headerCellText]}>Ashar</Text>
                    <Text style={[styles.colSessionLast, styles.headerCellText]}>Maghrib</Text>
                  </View>

                  {/* Table Rows */}
                  {dayData.absentList.map((item, index) => {
                    const sessionColumns: SesiHalaqoh[] = ["shubuh", "dhuha", "siang", "ashar", "maghrib"];

                    return (
                      <View
                        key={`${item.santriId}_${index}`}
                        style={[
                          styles.tableRow,
                          index % 2 === 1 ? styles.tableRowEven : {},
                        ]}
                      >
                        <Text style={styles.colNo}>{index + 1}</Text>
                        <View style={styles.colNamaNis}>
                          <Text style={styles.namaText}>{item.santriNama}</Text>
                          <Text style={styles.nisText}>NIS: {item.santriNis}</Text>
                        </View>
                        <Text style={styles.colKelas}>{item.kelas}</Text>
                        <Text style={styles.colHalaqoh}>{item.halaqohNama}</Text>
                        <Text style={styles.colGuru}>{item.guruNama}</Text>
                        {sessionColumns.map((sesi, sIdx) => {
                          const status = item.sessions[sesi];
                          const isLast = sIdx === 4;
                          const colStyle = isLast ? styles.colSessionLast : styles.colSession;
                          const cellStyle = status === "sakit" ? styles.sessionCellSakit
                            : status === "izin" ? styles.sessionCellIzin
                            : status === "alfa" ? styles.sessionCellAlfa
                            : styles.sessionCellEmpty;
                          const label = status === "sakit" ? "S" : status === "izin" ? "I" : status === "alfa" ? "A" : "—";
                          return (
                            <View key={sesi} style={colStyle}>
                              <Text style={cellStyle}>{label}</Text>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })}
                </View>

                {/* Daily Summary Bar */}
                <View style={styles.dailySummaryBar}>
                  <Text style={styles.summaryPill}>Total: {dayData.summary.total}</Text>
                  <Text style={styles.summaryPill}>Sakit: {dayData.summary.sakit}</Text>
                  <Text style={styles.summaryPill}>Izin: {dayData.summary.izin}</Text>
                  <Text style={styles.summaryPill}>Alfa: {dayData.summary.alfa}</Text>
                </View>
              </>
            )}
          </View>
        ))}

        {/* Overall Summary Box */}
        <View style={styles.overallBox} wrap={false}>
          <Text style={styles.overallTitle}>RINGKASAN KESELURUHAN PERIODE</Text>
          <View style={styles.overallGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Rentang Waktu</Text>
              <Text style={styles.statCardValue}>{overallSummary.totalDays} Hari</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Total Ketidakhadiran</Text>
              <Text style={styles.statCardValue}>{overallSummary.totalAbsences} Kejadian</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Rata-rata / Hari</Text>
              <Text style={styles.statCardValue}>{overallSummary.avgPerDay}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Total Sakit</Text>
              <Text style={[styles.statCardValue, styles.valSakit]}>
                {overallSummary.sakitTotal}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Total Izin</Text>
              <Text style={[styles.statCardValue, styles.valIzin]}>
                {overallSummary.izinTotal}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statCardLabel}>Total Alfa</Text>
              <Text style={[styles.statCardValue, styles.valAlfa]}>
                {overallSummary.alfaTotal}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Page Number */}
        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `MyHalaqoh Admin System • Laporan Ketidakhadiran Santri — Halaman ${pageNumber} dari ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
}
