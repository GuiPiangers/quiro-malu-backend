import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { ApiError } from "../../../../../../utils/ApiError";
import { CreateMessageSendStrategyUseCase } from "../CreateMessageSendStrategyUseCase";

describe("CreateMessageSendStrategyUseCase", () => {
  it("deve persistir estratégia send_most_recent_patients com amount válido", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const sut = new CreateMessageSendStrategyUseCase(repo);

    const result = await sut.execute({ userId: "user-1", amount: 20 });

    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        kind: "send_most_recent_patients",
        params: { amount: 20 },
      }),
    );
    expect(result.params.amount).toBe(20);
    expect(result.id).toBeDefined();
  });

  it("deve rejeitar amount fora do intervalo 1–50", async () => {
    const repo = createMockMessageSendStrategyRepository();
    const sut = new CreateMessageSendStrategyUseCase(repo);

    await expect(sut.execute({ userId: "user-1", amount: 0 })).rejects.toThrow(
      ApiError,
    );
    await expect(sut.execute({ userId: "user-1", amount: 51 })).rejects.toThrow(
      ApiError,
    );
    expect(repo.save).not.toHaveBeenCalled();
  });
});
