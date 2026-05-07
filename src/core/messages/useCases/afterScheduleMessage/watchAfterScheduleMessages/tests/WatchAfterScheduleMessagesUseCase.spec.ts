import { WatchAfterScheduleMessagesUseCase } from "../WatchAfterScheduleMessagesUseCase";

describe("WatchAfterScheduleMessagesUseCase", () => {
  it("execute completa sem efeito (configs vêm do banco no handler de agendamento)", async () => {
    const useCase = new WatchAfterScheduleMessagesUseCase();
    await expect(useCase.execute()).resolves.toBeUndefined();
  });
});
