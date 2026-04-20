import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { GetMessageSendStrategyUseCase } from "../GetMessageSendStrategyUseCase";

describe("GetMessageSendStrategyUseCase", () => {
  it("deve retornar a estratégia quando existe e pertence ao usuário", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue({
      id: "s-1",
      userId: "user-1",
      name: "Meu filtro",
      kind: "send_most_recent_patients",
      params: { amount: 10 },
      campaignBindingsCount: 2,
    });

    const sut = new GetMessageSendStrategyUseCase(repo);
    const result = await sut.execute({ userId: "user-1", strategyId: "s-1" });

    expect(repo.findByIdAndUserId).toHaveBeenCalledWith("s-1", "user-1");
    expect(result).toEqual({
      id: "s-1",
      userId: "user-1",
      name: "Meu filtro",
      kind: "send_most_recent_patients",
      params: { amount: 10 },
      campaignBindingsCount: 2,
    });
  });

  it("deve lançar 404 quando a estratégia não existe", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.findByIdAndUserId.mockResolvedValue(null);

    const sut = new GetMessageSendStrategyUseCase(repo);

    await expect(
      sut.execute({ userId: "user-1", strategyId: "s-x" }),
    ).rejects.toThrow(ApiError);
  });
});
