import { createMockPatientRepository } from "../../../../repositories/_mocks/PatientRepositoryMock";
import { createMockSchedulingRepository } from "../../../../repositories/_mocks/SchedulingRepositoryMock";
import { createMockWhatsAppMessageLogRepository } from "../../../../repositories/_mocks/WhatsAppMessageLogRepositoryMock";
import type { MessageSendStrategyRow } from "../../../../repositories/messageSendStrategy/IMessageSendStrategyRepository";
import { ApiError } from "../../../../utils/ApiError";
import { ExcludePatientsListStrategy } from "../strategies/excludePatientsListStrategy";
import { SendMostFrequencyPatientsStrategy } from "../strategies/sendMostFrequencyPatientsStrategy";
import { SendMostRecentPatientsStrategy } from "../strategies/sendMostRecentPatientsStrategy";
import { SendSelectedListStrategy } from "../strategies/sendSelectedListStrategy";
import { UniqueSendByPatientStrategy } from "../strategies/uniqueSendByPatientStrategy";
import { MessageSendStrategyFactory } from "../messageSendStrategyFactory";
import {
  SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
  SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
  SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
  SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
  SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT,
} from "../sendStrategyKind";

function baseRow(overrides: Partial<MessageSendStrategyRow>): MessageSendStrategyRow {
  return {
    id: "str-1",
    userId: "user-1",
    name: "Estratégia",
    kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
    params: { amount: 10 },
    campaignBindingsCount: 0,
    ...overrides,
  };
}

describe("MessageSendStrategyFactory", () => {
  const patientRepository = createMockPatientRepository();
  const schedulingRepository = createMockSchedulingRepository();
  const whatsAppMessageLogRepository = createMockWhatsAppMessageLogRepository();

  function sut() {
    return new MessageSendStrategyFactory(
      patientRepository,
      schedulingRepository,
      whatsAppMessageLogRepository,
    );
  }

  it("deve instanciar SendMostRecentPatientsStrategy para send_most_recent_patients", () => {
    const strategy = sut().create(
      baseRow({
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 15 },
      }),
    );

    expect(strategy).toBeInstanceOf(SendMostRecentPatientsStrategy);
    expect(strategy.kind).toBe(SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS);
  });

  it("deve instanciar SendMostFrequencyPatientsStrategy para send_most_frequency_patients", () => {
    const strategy = sut().create(
      baseRow({
        kind: SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS,
        params: { amount: 7 },
      }),
    );

    expect(strategy).toBeInstanceOf(SendMostFrequencyPatientsStrategy);
    expect(strategy.kind).toBe(SEND_STRATEGY_KIND_SEND_MOST_FREQUENCY_PATIENTS);
  });

  it("deve instanciar SendSelectedListStrategy para send_selected_list", () => {
    const strategy = sut().create(
      baseRow({
        kind: SEND_STRATEGY_KIND_SEND_SELECTED_LIST,
        params: { patientIdList: ["p-a", "p-b"] },
      }),
    );

    expect(strategy).toBeInstanceOf(SendSelectedListStrategy);
    expect(strategy.kind).toBe(SEND_STRATEGY_KIND_SEND_SELECTED_LIST);
  });

  it("deve instanciar ExcludePatientsListStrategy para exclude_patients_list", () => {
    const strategy = sut().create(
      baseRow({
        kind: SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST,
        params: { patientIdList: ["p-x"] },
      }),
    );

    expect(strategy).toBeInstanceOf(ExcludePatientsListStrategy);
    expect(strategy.kind).toBe(SEND_STRATEGY_KIND_EXCLUDE_PATIENTS_LIST);
  });

  it("deve instanciar UniqueSendByPatientStrategy para unique_send_by_patient", () => {
    const strategy = sut().create(
      baseRow({
        kind: SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT,
        params: {},
      }),
    );

    expect(strategy).toBeInstanceOf(UniqueSendByPatientStrategy);
    expect(strategy.kind).toBe(SEND_STRATEGY_KIND_UNIQUE_SEND_BY_PATIENT);
  });

  it("deve lançar ApiError 501 para kind desconhecido", () => {
    let caught: unknown;
    try {
      sut().create(
        baseRow({
          kind: "tipo_inexistente",
          params: {},
        }),
      );
    } catch (e) {
      caught = e;
    }

    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).statusCode).toBe(501);
    expect(String((caught as ApiError).message)).toContain("tipo_inexistente");
  });
});
