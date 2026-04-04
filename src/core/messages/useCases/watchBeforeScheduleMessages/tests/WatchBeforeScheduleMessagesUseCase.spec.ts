import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import { createMockBeforeScheduleMessageRepository } from "../../../../../repositories/_mocks/BeforeScheduleMessageRepositoryMock";
import { WatchBeforeScheduleMessagesUseCase } from "../watchBeforeScheduleMessagesUseCase";

describe("WatchBeforeScheduleMessagesUseCase", () => {
  it("should emit beforeScheduleMessageCreate for every stored config", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();

    beforeScheduleMessageRepository.listAll.mockResolvedValue([
      {
        id: "cfg-1",
        userId: "user-1",
        name: "a",
        minutesBeforeSchedule: 30,
        textTemplate: "x",
        isActive: true,
      },
      {
        id: "cfg-2",
        userId: "user-2",
        name: "b",
        minutesBeforeSchedule: 60,
        textTemplate: "y",
        isActive: false,
      },
    ]);

    const appEventListener = new AppEventListener();
    const emitSpy = jest.spyOn(appEventListener, "emit");

    const useCase = new WatchBeforeScheduleMessagesUseCase(
      beforeScheduleMessageRepository,
      appEventListener,
    );

    await useCase.execute();

    expect(emitSpy).toHaveBeenCalledWith("beforeScheduleMessageCreate", {
      id: "cfg-1",
      userId: "user-1",
      name: "a",
      minutesBeforeSchedule: 30,
      isActive: true,
    });

    expect(emitSpy).toHaveBeenCalledWith("beforeScheduleMessageCreate", {
      id: "cfg-2",
      userId: "user-2",
      name: "b",
      minutesBeforeSchedule: 60,
      isActive: false,
    });
  });

  it("should throw ApiError when config.id is missing", async () => {
    const beforeScheduleMessageRepository =
      createMockBeforeScheduleMessageRepository();

    beforeScheduleMessageRepository.listAll.mockResolvedValue([
      {
        id: undefined as any,
        userId: "user-1",
        name: "x",
        minutesBeforeSchedule: 30,
        textTemplate: "x",
        isActive: true,
      },
    ]);

    const appEventListener = new AppEventListener();

    const useCase = new WatchBeforeScheduleMessagesUseCase(
      beforeScheduleMessageRepository,
      appEventListener,
    );

    await expect(useCase.execute()).rejects.toBeInstanceOf(ApiError);
  });
});
