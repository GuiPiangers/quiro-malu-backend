import {
  SaveCalendarConfigurationUseCase,
  SaveCalendarConfigurationDTO,
} from "./SaveCalendarConfiguration";
import { CalendarConfiguration } from "../../models/CalendarConfiguration";
import { ICalendarConfigurationRepository } from "../../../../repositories/calendarConfiguration/ICalendarConfigurationRepository";
import { createMockCalendarConfigurationRepository } from "../../../../repositories/_mocks/CalendarConfigurationRepositoryMock";

describe("SaveCalendarConfigurationUseCase", () => {
  let useCase: SaveCalendarConfigurationUseCase;
  let repositoryMock: jest.Mocked<ICalendarConfigurationRepository>;

  beforeEach(() => {
    repositoryMock = createMockCalendarConfigurationRepository();
    useCase = new SaveCalendarConfigurationUseCase(repositoryMock);
  });

  const dto: SaveCalendarConfigurationDTO = {
    userId: "user-1",
    workTimeIncrementInMinutes: 30,
    domingo: {
      workSchedules: [{ start: "09:00", end: "18:00" }],
    },
  };

  it("should call save when no configuration exists for the user", async () => {
    repositoryMock.get.mockResolvedValue(null);

    await useCase.execute(dto);

    expect(repositoryMock.get).toHaveBeenCalledWith({ userId: dto.userId });
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.update).not.toHaveBeenCalled();

    const savedConfig =
      repositoryMock.save.mock.calls[0][0].calendarConfiguration;
    expect(savedConfig.userId).toBe(dto.userId);
  });

  it("should call update when a configuration already exists for the user", async () => {
    const existingConfig = new CalendarConfiguration({
      ...dto,
    });
    repositoryMock.get.mockResolvedValue(existingConfig);

    await useCase.execute(dto);

    expect(repositoryMock.get).toHaveBeenCalledWith({ userId: dto.userId });
    expect(repositoryMock.update).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).not.toHaveBeenCalled();

    const updatedConfig =
      repositoryMock.update.mock.calls[0][0].calendarConfiguration;
    expect(updatedConfig.userId).toBe(dto.userId);
  });
});
