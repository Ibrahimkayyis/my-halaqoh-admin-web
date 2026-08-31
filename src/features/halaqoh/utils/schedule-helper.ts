import type { SesiHalaqoh } from "@/features/kehadiran-guru/types/kehadiran-guru.types";

/**
 * ScheduleHelper matches the pesantren real schedule logic from mobile ScheduleHelper.
 *
 * Rules:
 * - Reguler (11 sessions/week):
 *   - Mon - Thu: ['shubuh', 'maghrib'] (2/day)
 *   - Fri: ['maghrib'] (1/day)
 *   - Sat: ['maghrib'] (1/day)
 *   - Sun: ['shubuh'] (1/day)
 *
 * - Takhassus (23 sessions/week):
 *   - Mon - Thu: ['shubuh', 'dhuha', 'siang', 'ashar', 'maghrib'] (5/day)
 *   - Fri: ['shubuh'] (1/day)
 *   - Sat: ['shubuh'] (1/day)
 *   - Sun: ['maghrib'] (1/day)
 */
export class ScheduleHelper {
  private constructor() {}

  /**
   * Return scheduled sessions for a specific date and program type.
   */
  static getScheduledSessionsForDay(
    date: Date,
    programType: "R" | "T" | "reguler" | "takhassus" | string
  ): SesiHalaqoh[] {
    const day = date.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
    const isTakhassus = programType === "T" || programType.toLowerCase() === "takhassus";

    if (isTakhassus) {
      if (day >= 1 && day <= 4) {
        // Monday - Thursday (5 sessions)
        return ["shubuh", "dhuha", "siang", "ashar", "maghrib"];
      }
      if (day === 5 || day === 6) {
        // Friday, Saturday (1 session: shubuh)
        return ["shubuh"];
      }
      // Sunday (1 session: maghrib)
      return ["maghrib"];
    }

    // Reguler
    if (day >= 1 && day <= 4) {
      // Monday - Thursday (2 sessions)
      return ["shubuh", "maghrib"];
    }
    if (day === 5 || day === 6) {
      // Friday, Saturday (1 session: maghrib)
      return ["maghrib"];
    }
    // Sunday (1 session: shubuh)
    return ["shubuh"];
  }

  /**
   * Count total scheduled sessions between start and end date inclusive.
   */
  static getTotalScheduledSessions(
    start: Date,
    end: Date,
    programType: "R" | "T" | "reguler" | "takhassus" | string
  ): number {
    const s = new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0, 0);
    const e = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);

    let total = 0;
    const current = new Date(s);

    while (current.getTime() <= e.getTime()) {
      total += this.getScheduledSessionsForDay(current, programType).length;
      current.setDate(current.getDate() + 1);
    }

    return total;
  }
}
