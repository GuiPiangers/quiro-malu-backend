import { DateTime } from "../../../shared/Date";
import { BlockSchedule } from "../BlockSchedule";
import { Scheduling } from "../Scheduling";

describe("BlockSchedule", () => {
  it("Should instantiate with the correct values", () => {
    const blockSchedule = new BlockSchedule({
      startDate: new DateTime("2025-01-01T10:00"),
      endDate: new DateTime("2025-01-01T11:00"),
      description: "Descrição",
    });

    expect(blockSchedule.startDate.dateTime).toBe("2025-01-01T10:00");
    expect(blockSchedule.endDate.dateTime).toBe("2025-01-01T11:00");
    expect(blockSchedule.description).toBe("Descrição");
  });

  describe("overlapsWith", () => {
    it("Should return true if the scheduling overlaps between the block schedule startDate and endDate", () => {
      const blockSchedule = new BlockSchedule({
        startDate: new DateTime("2025-01-01T10:00"),
        endDate: new DateTime("2025-01-01T11:00"),
        description: "Descrição",
      });

      const schedule = new Scheduling({
        patientId: "patientId",
        date: "2025-01-01T09:30",
        duration: 31 * 60, // 31 minutes endDate 10:31
      });

      const schedule2 = new Scheduling({
        patientId: "patientId",
        date: "2025-01-01T10:59",
        duration: 30 * 60,
      });

      expect(blockSchedule.overlapsWith(schedule)).toBe(true);
      expect(blockSchedule.overlapsWith(schedule2)).toBe(true);
    });

    it("Should return false if the scheduling not overlaps between the block schedule startDate and endDate", () => {
      const blockSchedule = new BlockSchedule({
        startDate: new DateTime("2025-01-01T10:00"),
        endDate: new DateTime("2025-01-01T11:00"),
        description: "Descrição",
      });

      const schedule = new Scheduling({
        patientId: "patientId",
        date: "2025-01-01T09:30",
        duration: 30 * 60, // 30 minutes endDate 10:30
      });

      const schedule2 = new Scheduling({
        patientId: "patientId",
        date: "2025-01-01T11:00",
        duration: 30 * 60,
      });

      expect(blockSchedule.overlapsWith(schedule)).toBe(false);
      expect(blockSchedule.overlapsWith(schedule2)).toBe(false);
    });
  });
});
