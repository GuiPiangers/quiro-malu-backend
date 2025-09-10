import { createMockCalendarConfigurationRepository } from "../../../../repositories/_mocks/CalendarConfigurationRepositoryMock";
import { ICalendarConfigurationRepository } from "../../../../repositories/calendarConfiguration/ICalendarConfigurationRepository";
import { GetCalendarConfigurationUseCase } from "./GetCalendarConfiguration";
import { CalendarConfiguration } from "../../models/CalendarConfiguration";

describe("GetCalendarConfigurationUseCase", () => {
  let useCase: GetCalendarConfigurationUseCase;
  let repositoryMock: jest.Mocked<ICalendarConfigurationRepository>;

  beforeEach(() => {
    repositoryMock = createMockCalendarConfigurationRepository();
    useCase = new GetCalendarConfigurationUseCase(repositoryMock);
  });

  const userId = "user-123";

  it("should return calendar configuration DTO when found", async () => {
    const configEntity = new CalendarConfiguration({
      userId,
      workTimeIncrementInMinutes: 60,
      domingo: {
        workSchedules: [{ start: "08:00", end: "17:00" }],
      },
    });
    repositoryMock.get.mockResolvedValue(configEntity);

    const result = await useCase.execute({ userId });

    expect(result).toEqual(configEntity.getDTO());
    expect(repositoryMock.get).toHaveBeenCalledWith({ userId });
    expect(repositoryMock.get).toHaveBeenCalledTimes(1);
  });

  it("should return null when calendar configuration is not found", async () => {
    repositoryMock.get.mockResolvedValue(null);

    const result = await useCase.execute({ userId });

    expect(result).toBeNull();
    expect(repositoryMock.get).toHaveBeenCalledWith({ userId });
    expect(repositoryMock.get).toHaveBeenCalledTimes(1);
  });
});
