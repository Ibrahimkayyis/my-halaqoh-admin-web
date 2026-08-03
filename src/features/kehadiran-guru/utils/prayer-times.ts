import { Coordinates, CalculationMethod, PrayerTimes } from "adhan";
import type { SesiHalaqoh } from "../types/kehadiran-guru.types";

/**
 * Pesantren location coordinates:
 * Jl. Kejawan Putih Tambak VI No.1, Mulyorejo, Surabaya, Jawa Timur 60112
 */
export const PESANTREN_COORDINATES = {
  latitude: -7.2798,
  longitude: 112.7967,
};

export interface SessionTimeBoundary {
  sesi: SesiHalaqoh;
  start: Date;
  end: Date;
}

/**
 * Calculate prayer times for a given date using Kemenag RI method (MABIMS / Singapore standard in adhan)
 */
export function getPrayerTimesForDate(date: Date = new Date()) {
  const coords = new Coordinates(
    PESANTREN_COORDINATES.latitude,
    PESANTREN_COORDINATES.longitude
  );
  const params = CalculationMethod.Singapore(); // 20° Fajr, 18° Isha (Kemenag RI standard)
  return new PrayerTimes(coords, date, params);
}

/**
 * Helper to build a Date object on `date` with specific hours and minutes
 */
function createTimeOnDate(baseDate: Date, hours: number, minutes: number): Date {
  const result = new Date(baseDate);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Get exact start and end boundaries for all sessions on a given date for a program type.
 */
export function getSessionBoundaries(
  programType: "R" | "T",
  date: Date = new Date()
): SessionTimeBoundary[] {
  const prayerTimes = getPrayerTimesForDate(date);

  // 1. Shubuh: Starts at Fajr prayer time, ends at 06:00 AM
  const shubuhStart = new Date(prayerTimes.fajr);
  const shubuhEnd = createTimeOnDate(date, 6, 0);

  // 5. Maghrib: Starts at Maghrib prayer time, ends at Isha prayer time
  const maghribStart = new Date(prayerTimes.maghrib);
  const maghribEnd = new Date(prayerTimes.isha);

  if (programType === "R") {
    return [
      { sesi: "shubuh", start: shubuhStart, end: shubuhEnd },
      { sesi: "maghrib", start: maghribStart, end: maghribEnd },
    ];
  }

  // Takhassus (5 sessions)
  // 2. Dhuha: 08:00 - 09:30
  const dhuhaStart = createTimeOnDate(date, 8, 0);
  const dhuhaEnd = createTimeOnDate(date, 9, 30);

  // 3. Siang: 10:00 - 11:00
  const siangStart = createTimeOnDate(date, 10, 0);
  const siangEnd = createTimeOnDate(date, 11, 0);

  // 4. Ashar: Starts at Ashar prayer time, ends +1 hour (60 minutes)
  const asharStart = new Date(prayerTimes.asr);
  const asharEnd = new Date(prayerTimes.asr.getTime() + 60 * 60 * 1000);

  return [
    { sesi: "shubuh", start: shubuhStart, end: shubuhEnd },
    { sesi: "dhuha", start: dhuhaStart, end: dhuhaEnd },
    { sesi: "siang", start: siangStart, end: siangEnd },
    { sesi: "ashar", start: asharStart, end: asharEnd },
    { sesi: "maghrib", start: maghribStart, end: maghribEnd },
  ];
}

/**
 * Determine the current session for a program based on exact prayer times and schedules.
 * - If current time falls inside a session window, returns that session.
 * - If current time falls in a gap between sessions, returns the most recently ended session.
 * - If current time is before the first session of the day, returns the first session (or maghrib).
 */
export function getCurrentSessionForProgram(
  programType: "R" | "T",
  now: Date = new Date()
): SesiHalaqoh {
  const boundaries = getSessionBoundaries(programType, now);
  const nowMs = now.getTime();

  // Check if `now` falls strictly inside any session
  for (const boundary of boundaries) {
    if (nowMs >= boundary.start.getTime() && nowMs < boundary.end.getTime()) {
      return boundary.sesi;
    }
  }

  // If now is before the first session of today (shubuhStart)
  if (nowMs < boundaries[0].start.getTime()) {
    return programType === "R" ? "maghrib" : "shubuh";
  }

  // If in a gap between sessions or after the last session, find the latest session whose start <= now
  let lastActiveSession: SesiHalaqoh = boundaries[0].sesi;
  for (const boundary of boundaries) {
    if (nowMs >= boundary.start.getTime()) {
      lastActiveSession = boundary.sesi;
    }
  }

  return lastActiveSession;
}
