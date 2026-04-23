import { ApiError } from "../../../../utils/ApiError";
import { MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS } from "../../models/SendSelectedListMessageSendStrategy";
import { parseHttpPatientIdList } from "../messageSendStrategyPatientListHttp";

describe("parseHttpPatientIdList", () => {
  it("deve normalizar trim e deduplicar preservando ordem", () => {
    const ids = parseHttpPatientIdList(["  a ", "b", " a"]);
    expect(ids).toEqual(["a", "b"]);
  });

  it("deve rejeitar array vazio após deduplicação", () => {
    expect(() => parseHttpPatientIdList(["", "  "])).toThrow(ApiError);
  });

  it("permite array vazio após deduplicação quando allowEmpty", () => {
    expect(parseHttpPatientIdList(["", "  "], { allowEmpty: true })).toEqual([]);
  });

  it("permite lista bruta maior que o máximo se após deduplicação couber na entidade", () => {
    const list = Array.from({ length: MESSAGE_SEND_STRATEGY_SELECTED_LIST_MAX_IDS + 5 }, () => "same-id");
    const ids = parseHttpPatientIdList(list);
    expect(ids).toEqual(["same-id"]);
  });

  it("deve rejeitar quando não for array", () => {
    expect(() => parseHttpPatientIdList({})).toThrow(ApiError);
  });
});
