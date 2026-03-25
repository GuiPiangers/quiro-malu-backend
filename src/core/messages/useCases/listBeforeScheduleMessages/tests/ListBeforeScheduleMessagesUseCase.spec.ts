import { createMockBeforeScheduleMessageRepository } from "../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { ListBeforeScheduleMessagesUseCase } from "../ListBeforeScheduleMessagesUseCase";

describe("ListBeforeScheduleMessagesUseCase", () => {
  it("should list before schedule message configs by user", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();

    beforeScheduleMessageRepository.listByUserId.mockResolvedValue([
      {
        id: "cfg-1",
        userId: "user-1",
        minutesBeforeSchedule: 30,
        textTemplate: "Olá {{nome}}",
        isActive: true,
      },
    ]);

    const useCase = new ListBeforeScheduleMessagesUseCase(
      beforeScheduleMessageRepository,
    );

    const result = await useCase.execute({ userId: "user-1" });

    expect(beforeScheduleMessageRepository.listByUserId).toHaveBeenCalledWith({
      userId: "user-1",
    });

    expect(result).toEqual([
      {
        id: "cfg-1",
        minutesBeforeSchedule: 30,
        isActive: true,
        messageTemplate: {
          id: expect.any(String),
          textTemplate: "Olá {{nome}}",
        },
      },
    ]);
  });
});
