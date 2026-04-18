import { createMockMessageSendStrategyRepository } from "../../../../../../repositories/_mocks/MessageSendStrategyRepositoryMock";
import { DeleteMessageSendStrategyUseCase } from "../DeleteMessageSendStrategyUseCase";

describe("DeleteMessageSendStrategyUseCase", () => {
  it("deve delegar delete ao repositório", async () => {
    const repo = createMockMessageSendStrategyRepository();
    repo.deleteByIdAndUserId.mockResolvedValue(undefined);

    const sut = new DeleteMessageSendStrategyUseCase(repo);

    await sut.execute({ userId: "user-1", strategyId: "s-1" });

    expect(repo.deleteByIdAndUserId).toHaveBeenCalledWith("s-1", "user-1");
  });
});
