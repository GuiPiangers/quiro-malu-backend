import { ApiError } from "../../../../utils/ApiError";
import { ExcludePatientsListMessageSendStrategy } from "../ExcludePatientsListMessageSendStrategy";
import { MessageSendStrategyDisplayName } from "../MessageSendStrategyDisplayName";
import { MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS } from "../SendSelectedListMessageSendStrategy";

describe("ExcludePatientsListMessageSendStrategy", () => {
  const displayName = new MessageSendStrategyDisplayName("Estratégia");

  it("aceita lista vazia", () => {
    const entity = new ExcludePatientsListMessageSendStrategy({
      displayName,
      patientIdList: [],
    });
    expect(entity.patientIdList).toEqual([]);
  });

  it("aceita lista com tamanho no limite máximo", () => {
    const patientIdList = Array.from(
      { length: MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS },
      (_, i) => `p-${i}`,
    );
    const entity = new ExcludePatientsListMessageSendStrategy({
      displayName,
      patientIdList,
    });
    expect(entity.patientIdList.length).toBe(MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS);
  });

  it("rejeita lista acima do máximo permitido", () => {
    const patientIdList = Array.from(
      { length: MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS + 1 },
      (_, i) => `p-${i}`,
    );
    expect(
      () =>
        new ExcludePatientsListMessageSendStrategy({
          displayName,
          patientIdList,
        }),
    ).toThrow(ApiError);
  });

  it("remove ids duplicados preservando a ordem da primeira ocorrência", () => {
    const entity = new ExcludePatientsListMessageSendStrategy({
      displayName,
      patientIdList: ["p-1", "p-2", "p-1", "p-3", "p-2"],
    });
    expect([...entity.patientIdList]).toEqual(["p-1", "p-2", "p-3"]);
  });
});
