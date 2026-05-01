import { createMockMessageSendStrategyRepository } from "../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS } from "../sendStrategyKind";
import { MessageSendStrategyEnforcer } from "../messageSendStrategyEnforcer";

describe("MessageSendStrategyEnforcer", () => {
  it("deve retornar true quando não houver estratégias vinculadas à campanha", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findActiveStrategiesByUserAndCampaign.mockResolvedValue([]);

    const factory = { create: vi.fn() };

    const sut = new MessageSendStrategyEnforcer(repo as any, factory as any);

    const allowed = await sut.isSendAllowed({
      userId: "user-1",
      campaignId: "camp-1",
      patientId: "patient-1",
    });

    expect(allowed).toBe(true);
    expect(repo.findActiveStrategiesByUserAndCampaign).toHaveBeenCalledWith(
      "user-1",
      "camp-1",
    );
    expect(factory.create).not.toHaveBeenCalled();
  });

  it("deve retornar true quando todas as estratégias permitirem o envio", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findActiveStrategiesByUserAndCampaign.mockResolvedValue([
      {
        id: "s-1",
        userId: "user-1",
        name: "A",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 10 },
        campaignBindingsCount: 1,
      },
      {
        id: "s-2",
        userId: "user-1",
        name: "B",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 5 },
        campaignBindingsCount: 1,
      },
    ]);

    const factory = {
      create: vi.fn().mockReturnValue({
        allowsSend: vi.fn().mockResolvedValue(true),
      }),
    };

    const sut = new MessageSendStrategyEnforcer(repo as any, factory as any);

    const allowed = await sut.isSendAllowed({
      userId: "user-1",
      campaignId: "camp-1",
      patientId: "patient-1",
    });

    expect(allowed).toBe(true);
    expect(factory.create).toHaveBeenCalledTimes(2);
    expect(factory.create.mock.calls[0][0].id).toBe("s-1");
    expect(factory.create.mock.calls[1][0].id).toBe("s-2");
  });

  it("deve retornar false quando alguma estratégia negar o envio", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findActiveStrategiesByUserAndCampaign.mockResolvedValue([
      {
        id: "s-1",
        userId: "user-1",
        name: "A",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 10 },
        campaignBindingsCount: 1,
      },
      {
        id: "s-2",
        userId: "user-1",
        name: "B",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 5 },
        campaignBindingsCount: 1,
      },
    ]);

    const allowsSend = vi
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    const factory = {
      create: vi.fn().mockReturnValue({ allowsSend }),
    };

    const sut = new MessageSendStrategyEnforcer(repo as any, factory as any);

    const allowed = await sut.isSendAllowed({
      userId: "user-1",
      campaignId: "camp-1",
      patientId: "patient-1",
    });

    expect(allowed).toBe(false);
    expect(allowsSend).toHaveBeenCalledTimes(2);
    expect(allowsSend).toHaveBeenNthCalledWith(1, {
      userId: "user-1",
      patientId: "patient-1",
    });
    expect(allowsSend).toHaveBeenNthCalledWith(2, {
      userId: "user-1",
      patientId: "patient-1",
    });
  });

  it("deve retornar false na primeira estratégia que negar sem avaliar as seguintes", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findActiveStrategiesByUserAndCampaign.mockResolvedValue([
      {
        id: "s-1",
        userId: "user-1",
        name: "A",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 10 },
        campaignBindingsCount: 1,
      },
      {
        id: "s-2",
        userId: "user-1",
        name: "B",
        kind: SEND_STRATEGY_KIND_SEND_MOST_RECENT_PATIENTS,
        params: { amount: 5 },
        campaignBindingsCount: 1,
      },
    ]);

    const allowsSendFirst = vi.fn().mockResolvedValue(false);
    const factory = {
      create: vi
        .fn()
        .mockReturnValueOnce({ allowsSend: allowsSendFirst })
        .mockReturnValueOnce({
          allowsSend: vi.fn().mockResolvedValue(true),
        }),
    };

    const sut = new MessageSendStrategyEnforcer(repo as any, factory as any);

    const allowed = await sut.isSendAllowed({
      userId: "user-1",
      campaignId: "camp-1",
      patientId: "patient-1",
    });

    expect(allowed).toBe(false);
    expect(factory.create).toHaveBeenCalledTimes(1);
    expect(allowsSendFirst).toHaveBeenCalledTimes(1);
  });
});
