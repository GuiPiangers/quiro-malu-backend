import { DateTime } from "../../../shared/Date";
import {
  TriggerWithDelay,
  TriggerDTO,
  TriggerWithDelayConfig,
} from "../Trigger";

const mockEvent = "createPatient";

describe("TriggerBase", () => {
  it("deve inicializar corretamente com os valores fornecidos", () => {
    const dto: TriggerDTO<TriggerWithDelayConfig> = {
      event: mockEvent,
      config: { delay: 10, delayUnit: "minutes" },
    };
    const trigger = new TriggerWithDelay(dto);

    expect(trigger.event).toBe(mockEvent);
  });

  it("deve definir config como config.delay = 0 e config.delayUnit = 'minutes' se não for fornecido", () => {
    const dto: TriggerDTO<TriggerWithDelayConfig> = { event: mockEvent };
    const trigger = new TriggerWithDelay(dto);

    expect(trigger.config).toEqual({ delay: 0, delayUnit: "minutes" });
  });

  describe("calculateDelay", () => {
    it("deve calcular corretamente o delay com a data fornecida e o atributo config.delayUnit = 'minutes'", () => {
      const dto: TriggerDTO<TriggerWithDelayConfig> = {
        event: mockEvent,
        config: { delay: 10, delayUnit: "minutes" },
      };
      const trigger = new TriggerWithDelay(dto);

      const now = DateTime.now();
      const delay = trigger.calculateDelay({ date: now });

      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeCloseTo(10 * 60 * 1000, -10); // Aproximadamente 10 minutos em ms
    });

    it("deve calcular corretamente o delay com a data fornecida e o atributo config.delayUnit = 'hours'", () => {
      const dto: TriggerDTO<TriggerWithDelayConfig> = {
        event: mockEvent,
        config: { delay: 10, delayUnit: "hours" },
      };
      const trigger = new TriggerWithDelay(dto);

      const now = DateTime.now();
      const delay = trigger.calculateDelay({ date: now });

      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeCloseTo(10 * 60 * 60 * 1000, -10); // Aproximadamente 10 horas em ms
    });

    it("deve calcular corretamente o delay com a data fornecida e o atributo config.delayUnit = 'days'", () => {
      const dto: TriggerDTO<TriggerWithDelayConfig> = {
        event: mockEvent,
        config: { delay: 10, delayUnit: "days" },
      };
      const trigger = new TriggerWithDelay(dto);

      const now = DateTime.now();
      const delay = trigger.calculateDelay({ date: now });

      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeCloseTo(10 * 60 * 60 * 24 * 1000, -10); // Aproximadamente 10 dias em ms
    });
  });

  describe("getDTO", () => {
    it("Deve retornar o triggerDTO correto", () => {
      const triggerDTO: TriggerDTO<TriggerWithDelayConfig> = {
        event: mockEvent,
        config: { delay: 10, delayUnit: "minutes" },
      };

      const trigger = new TriggerWithDelay(triggerDTO);

      expect(trigger.getDTO()).toEqual(triggerDTO);
    });
  });
});
