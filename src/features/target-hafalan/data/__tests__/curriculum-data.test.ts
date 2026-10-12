import { describe, it, expect } from "vitest";
import {
  CURRICULUM_REGULER,
  CURRICULUM_TAKHASSUS,
  getCurriculumByProgram,
} from "../curriculum-data";

describe("Curriculum Data and Helper Functions", () => {
  it("should contain 6 classes (7-12) for CURRICULUM_REGULER", () => {
    expect(CURRICULUM_REGULER.length).toBe(6);
    const classes = CURRICULUM_REGULER.map((c) => c.kelas);
    expect(classes).toEqual(["7", "8", "9", "10", "11", "12"]);
  });

  it("should contain 6 classes (7-12) for CURRICULUM_TAKHASSUS", () => {
    expect(CURRICULUM_TAKHASSUS.length).toBe(6);
    const classes = CURRICULUM_TAKHASSUS.map((c) => c.kelas);
    expect(classes).toEqual(["7", "8", "9", "10", "11", "12"]);
  });

  it("should return CURRICULUM_REGULER when calling getCurriculumByProgram('R')", () => {
    const res = getCurriculumByProgram("R");
    expect(res).toBe(CURRICULUM_REGULER);
  });

  it("should return CURRICULUM_TAKHASSUS when calling getCurriculumByProgram('T')", () => {
    const res = getCurriculumByProgram("T");
    expect(res).toBe(CURRICULUM_TAKHASSUS);
  });

  it("every class in curriculum should have valid semester1 and semester2 items with PTS and PAS", () => {
    [...CURRICULUM_REGULER, ...CURRICULUM_TAKHASSUS].forEach((item) => {
      expect(item.semester1.items.length).toBeGreaterThan(0);
      expect(item.semester2.items.length).toBeGreaterThan(0);
      expect(item.semester1.items.some((i) => i.type === "PTS 1")).toBe(true);
      expect(item.semester1.items.some((i) => i.type === "PAS 1")).toBe(true);
      expect(item.semester2.items.some((i) => i.type === "PTS 2")).toBe(true);
      expect(item.semester2.items.some((i) => i.type === "PAS 2")).toBe(true);
    });
  });
});
