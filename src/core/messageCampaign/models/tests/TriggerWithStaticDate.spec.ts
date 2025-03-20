import { DateTime } from "../../../shared/Date";
import { DateTime as Luxon } from "luxon";
import {
  TriggerWithStaticDate,
  TriggerDTO,
  TriggerWithStaticDateConfig,
} from "../Trigger";

const mockEvent = "createPatient";

describe("TriggerBase", () => {
  it("deve inicializar corretamente com os valores fornecidos", () => {
    const dto: TriggerDTO<TriggerWithStaticDateConfig> = {
      event: mockEvent,
      config: { date: new DateTime("2025-01-01T10:00") },
    };
    const trigger = new TriggerWithStaticDate(dto);

    expect(trigger.event).toBe(mockEvent);
  });

  it("deve definir config como config.date para a data atual se não for fornecido", () => {
    const dto: TriggerDTO<TriggerWithStaticDateConfig> = { event: mockEvent };
    const trigger = new TriggerWithStaticDate(dto);

    expect(trigger.config.date.dateTime).toBe(DateTime.now().dateTime);
  });

  describe("calculateDelay", () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(
        Luxon.fromISO("2025-01-01T10:00", {
          zone: "America/Sao_Paulo",
        }).toMillis(),
      );
    });

    it("deve calcular corretamente o delay com a data fornecida no config.date", () => {
      const dto: TriggerDTO<TriggerWithStaticDateConfig> = {
        event: mockEvent,
        config: { date: new DateTime("2025-01-11T10:00") },
      };
      const trigger = new TriggerWithStaticDate(dto);

      const delay = trigger.calculateDelay();

      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeCloseTo(60 * 60 * 1000 * 24 * 10, -10); // Aproximadamente 10 dias em ms
    });

    it("deve retornar 0 se a config.date for igual a data atual", () => {
      const dto: TriggerDTO<TriggerWithStaticDateConfig> = {
        event: mockEvent,
        config: { date: new DateTime("2025-01-01T10:00") },
      };
      const trigger = new TriggerWithStaticDate(dto);

      const delay = trigger.calculateDelay();

      expect(delay).toBe(0);
    });

    it("deve retornar 0 se a config.date for anterior a data atual", () => {
      const dto: TriggerDTO<TriggerWithStaticDateConfig> = {
        event: mockEvent,
        config: { date: new DateTime("2025-01-01T09:00") },
      };
      const trigger = new TriggerWithStaticDate(dto);

      const delay = trigger.calculateDelay();

      expect(delay).toBe(0);
    });
  });

  describe("getDTO", () => {
    it("Deve retornar o triggerDTO correto", () => {
      const triggerDTO: TriggerDTO<TriggerWithStaticDateConfig> = {
        event: mockEvent,
        config: { date: new DateTime("2025-01-01T10:00") },
      };

      const trigger = new TriggerWithStaticDate(triggerDTO);

      expect(trigger.getDTO()).toEqual(triggerDTO);
    });
  });
});
