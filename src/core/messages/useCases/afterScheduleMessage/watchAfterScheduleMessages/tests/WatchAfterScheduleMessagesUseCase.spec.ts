import { ApiError } from "../../../../../../utils/ApiError";
import { AppEventListener } from "../../../../../shared/observers/EventListener";
import { createMockAfterScheduleMessageRepository } from "../../../../../../repositories/_mocks/AfterScheduleMessageRepositoryMock";
import { WatchAfterScheduleMessagesUseCase } from "../WatchAfterScheduleMessagesUseCase";

describe("WatchAfterScheduleMessagesUseCase", () => {
  it("deve emitir afterScheduleMessageCreate para cada config armazenada", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();

    afterScheduleMessageRepository.listAll.mockResolvedValue([
      {
        id: "cfg-1",
        userId: "user-1",
        name: "a",
        minutesAfterSchedule: 30,
        textTemplate: "x",
        isActive: true,
      },
      {
        id: "cfg-2",
        userId: "user-2",
        name: "b",
        minutesAfterSchedule: 60,
        textTemplate: "y",
        isActive: false,
      },
    ]);

    const appEventListener = new AppEventListener();
    const emitSpy = vi.spyOn(appEventListener, "emit");

    const useCase = new WatchAfterScheduleMessagesUseCase(
      afterScheduleMessageRepository,
      appEventListener,
    );

    await useCase.execute();

    expect(emitSpy).toHaveBeenCalledWith("afterScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "a",
      minutesAfterSchedule: 30,
      isActive: true,
    });

    expect(emitSpy).toHaveBeenCalledWith("afterScheduleMessageCreate", {
      id: "cfg-2",
      userId: "user-2",
      name: "b",
      minutesAfterSchedule: 60,
      isActive: false,
    });
  });

  it("deve lançar ApiError quando config.id estiver ausente", async () => {
    const afterScheduleMessageRepository = createMockAfterScheduleMessageRepository();

    afterScheduleMessageRepository.listAll.mockResolvedValue([
      {
        id: undefined as any,
        userId: "user-1",
        name: "x",
        minutesAfterSchedule: 30,
        textTemplate: "x",
        isActive: true,
      },
    ]);

    const appEventListener = new AppEventListener();

    const useCase = new WatchAfterScheduleMessagesUseCase(
      afterScheduleMessageRepository,
      appEventListener,
    );

    await expect(useCase.execute()).rejects.toBeInstanceOf(ApiError);
  });
});
