import { WatchBeforeScheduleMessagesUseCase } from "../watchBeforeScheduleMessagesUseCase";

describe("WatchBeforeScheduleMessagesUseCase", () => {
  it("execute completa sem efeito (configs vêm do banco no handler de agendamento)", async () => {
    const useCase = new WatchBeforeScheduleMessagesUseCase();
    await expect(useCase.execute()).resolves.toBeUndefined();
  });
});
