import { createMockAfterScheduleMessageRepository } from "../../../../../../repositories/_mocks/AfterScheduleMessageRepositoryMock";
import { ListAfterScheduleMessagesUseCase } from "../ListAfterScheduleMessagesUseCase";

describe("ListAfterScheduleMessagesUseCase", () => {
  it("deve listar configs de mensagem pós-consulta por usuário", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();

    afterScheduleMessageRepository.listByUserId.mockResolvedValue([
      {
        id: "cfg-1",
        userId: "user-1",
        name: "Lista",
        minutesAfterSchedule: 30,
        textTemplate: "Olá {{nome}}",
        isActive: true,
      },
    ]);

    const useCase = new ListAfterScheduleMessagesUseCase(afterScheduleMessageRepository);

    const result = await useCase.execute({ userId: "user-1" });

    expect(afterScheduleMessageRepository.listByUserId).toHaveBeenCalledWith({
      userId: "user-1",
    });

    expect(result).toEqual([
      {
        id: "cfg-1",
        name: "Lista",
        minutesAfterSchedule: 30,
        isActive: true,
        messageTemplate: {
          id: expect.any(String),
          textTemplate: "Olá {{nome}}",
        },
      },
    ]);
  });
});
