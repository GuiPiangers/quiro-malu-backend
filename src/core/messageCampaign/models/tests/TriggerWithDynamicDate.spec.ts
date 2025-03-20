import { DateTime } from "../../../shared/Date";
import { TriggerWithDynamicDate, TriggerDTO } from "../Trigger";
import { DateTime as Luxon } from "luxon";

const mockEvent = "createPatient";

describe("TriggerBase", () => {
  it("deve inicializar corretamente com os valores fornecidos", () => {
    const dto: TriggerDTO = {
      event: mockEvent,
    };
    const trigger = new TriggerWithDynamicDate(dto);

    expect(trigger.event).toBe(mockEvent);
  });

  describe("calculateDelay", () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(
        Luxon.fromISO("2025-01-01T10:00", {
          zone: "America/Sao_Paulo",
        }).toMillis(),
      );
    });
    it("deve calcular corretamente o delay com a data fornecida", () => {
      const dto: TriggerDTO = {
        event: mockEvent,
      };
      const trigger = new TriggerWithDynamicDate(dto);

      const date = new DateTime("2025-01-01T12:00");
      const delay = trigger.calculateDelay({ date });

      expect(delay).toBeGreaterThan(0);
      expect(delay).toBe(1000 * 60 * 60 * 2); // 2 horas em ms
    });

    it("deve retornar 0 se a data for igual a data atual", () => {
      const dto: TriggerDTO = {
        event: mockEvent,
      };
      const trigger = new TriggerWithDynamicDate(dto);

      const date = new DateTime("2025-01-01T10:00");
      const delay = trigger.calculateDelay({ date });

      expect(delay).toBe(0);
    });
  });

  describe("getDTO", () => {
    it("Deve retornar o triggerDTO correto", () => {
      const triggerDTO: TriggerDTO = {
        event: mockEvent,
      };

      const trigger = new TriggerWithDynamicDate(triggerDTO);

      expect(trigger.getDTO()).toEqual({
        event: mockEvent,
        config: {},
      });
    });
  });
});
