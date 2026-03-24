import { createMockBeforeScheduleMessageRepository } from "../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { CreateBeforeScheduleMessageUseCase } from "../CreateBeforeScheduleMessageUseCase";

describe("CreateBeforeScheduleMessageUseCase", () => {
  it("should create entity and persist message", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();

    const useCase = new CreateBeforeScheduleMessageUseCase(
      beforeScheduleMessageRepository,
    );

    const result = await useCase.execute({
      userId: "user-1",
      minutesBeforeSchedule: 60,
      messageTemplate: {
        textTemplate: "Oi {{nome}}, seu horario esta proximo.",
      },
    });

    expect(beforeScheduleMessageRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        minutesBeforeSchedule: 60,
        textTemplate: "Oi {{nome}}, seu horario esta proximo.",
      }),
    );

    expect(result).toEqual({
      id: result.id,
      minutesBeforeSchedule: 60,
      messageTemplate: {
        id: result.messageTemplate.id,
        textTemplate: "Oi {{nome}}, seu horario esta proximo.",
      },
    });
  });
});
