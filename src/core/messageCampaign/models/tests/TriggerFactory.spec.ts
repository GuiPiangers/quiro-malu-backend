import { triggerFactory } from "../TriggerFactor";
import {
  TriggerWithDelay,
  TriggerWithDynamicDate,
  TriggerWithStaticDate,
  TriggerDTO,
  TriggerWithDelayConfig,
} from "../Trigger";

describe("triggerFactory", () => {
  it("deve retornar uma instância de TriggerWithDelay para eventos com atraso", () => {
    const dto: TriggerDTO<any> = {
      event: "createPatient",
      config: { delay: 10, delayUnit: "minutes" },
    };
    const trigger = triggerFactory(dto);

    expect(trigger).toBeInstanceOf(TriggerWithDelay);
    expect(trigger.event).toBe("createPatient");
  });

  it("deve retornar uma instância de TriggerWithDynamicDate para eventos com data dinâmica", () => {
    const dto: TriggerDTO = { event: "patientBirthDay" };
    const trigger = triggerFactory(dto);

    expect(trigger).toBeInstanceOf(TriggerWithDynamicDate);
    expect(trigger.event).toBe("patientBirthDay");
  });

  it("deve retornar uma instância de TriggerWithStaticDate para eventos que não se encaixam nos outros casos", () => {
    const dto: TriggerDTO<any> = {
      event: "updatePatient",
      config: { date: "2025-01-01" },
    };
    const trigger = triggerFactory(dto);

    expect(trigger).toBeInstanceOf(TriggerWithStaticDate);
    expect(trigger.event).toBe("updatePatient");
  });
});
