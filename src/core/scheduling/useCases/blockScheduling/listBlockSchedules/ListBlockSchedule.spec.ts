import { createMockBlockScheduleRepository } from "../../../../../repositories/_mocks/BlockScheduleRepositoryMock";
import { DateTime } from "../../../../shared/Date";
import { BlockSchedule } from "../../../models/BlockSchedule";
import { BlockScheduleDto } from "../../../models/dtos/BlockSchedule.dto";
import { ApiError } from "../../../../../utils/ApiError";

import {
  ListBlockSchedulingUseCase,
  ListBlockSchedulingDTO,
} from "./ListBlockSchedulingUseCase";

describe("ListBlockScheduleUseCase", () => {
  let listBlockSchedulingUseCase: ListBlockSchedulingUseCase;
  const mockBlockSchedulingRepository = createMockBlockScheduleRepository();

  beforeAll(() => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2025-01-10T12:00:00Z").getTime());
  });

  beforeEach(() => {
    jest.clearAllMocks();
    listBlockSchedulingUseCase = new ListBlockSchedulingUseCase(
      mockBlockSchedulingRepository,
    );
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("execute", () => {
    const validDTO: ListBlockSchedulingDTO = {
      userId: "user-123",
      startDate: "2025-01-01T10:00:00Z",
      endDate: "2025-01-01T18:00:00Z",
    };

    const mockBlockSchedules: BlockSchedule[] = [
      new BlockSchedule({
        id: "block-1",
        startDate: new DateTime("2025-01-01T10:00:00Z"),
        endDate: new DateTime("2025-01-01T11:00:00Z"),
        description: "Reunião importante",
      }),
      new BlockSchedule({
        id: "block-2",
        startDate: new DateTime("2025-01-01T14:00:00Z"),
        endDate: new DateTime("2025-01-01T15:00:00Z"),
        description: "Almoço",
      }),
    ];

    const expectedBlockScheduleDtos: BlockScheduleDto[] = [
      {
        id: "block-1",
        startDate: "2025-01-01T10:00",
        endDate: "2025-01-01T11:00",
        description: "Reunião importante",
      },
      {
        id: "block-2",
        startDate: "2025-01-01T14:00",
        endDate: "2025-01-01T15:00",
        description: "Almoço",
      },
    ];

    it("should list block schedules successfully", async () => {
      mockBlockSchedulingRepository.listBetweenDates.mockResolvedValue(
        mockBlockSchedules,
      );

      const result = await listBlockSchedulingUseCase.execute(validDTO);

      expect(result).toEqual(expectedBlockScheduleDtos);
      expect(
        mockBlockSchedulingRepository.listBetweenDates,
      ).toHaveBeenCalledWith({
        userId: validDTO.userId,
        startDate: expect.any(DateTime),
        endDate: expect.any(DateTime),
      });
      expect(
        mockBlockSchedulingRepository.listBetweenDates,
      ).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no block schedules found", async () => {
      mockBlockSchedulingRepository.listBetweenDates.mockResolvedValue([]);

      const result = await listBlockSchedulingUseCase.execute(validDTO);

      expect(result).toEqual([]);
      expect(
        mockBlockSchedulingRepository.listBetweenDates,
      ).toHaveBeenCalledTimes(1);
    });

    it("should throw ApiError when startDate is equal to endDate", async () => {
      const invalidDTO: ListBlockSchedulingDTO = {
        userId: "user-123",
        startDate: "2025-01-01T10:00:00Z",
        endDate: "2025-01-01T10:00:00Z",
      };

      await expect(
        listBlockSchedulingUseCase.execute(invalidDTO),
      ).rejects.toThrow(ApiError);
      await expect(
        listBlockSchedulingUseCase.execute(invalidDTO),
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it("should throw ApiError when startDate is after endDate", async () => {
      const invalidDTO: ListBlockSchedulingDTO = {
        userId: "user-123",
        startDate: "2025-01-01T18:00:00Z",
        endDate: "2025-01-01T10:00:00Z",
      };

      await expect(
        listBlockSchedulingUseCase.execute(invalidDTO),
      ).rejects.toThrow(ApiError);
      await expect(
        listBlockSchedulingUseCase.execute(invalidDTO),
      ).rejects.toMatchObject({
        statusCode: 400,
      });
    });

    it("should convert string dates to DateTime objects correctly", async () => {
      mockBlockSchedulingRepository.listBetweenDates.mockResolvedValue([]);

      await listBlockSchedulingUseCase.execute(validDTO);

      expect(
        mockBlockSchedulingRepository.listBetweenDates,
      ).toHaveBeenCalledWith({
        userId: validDTO.userId,
        startDate: expect.any(DateTime),
        endDate: expect.any(DateTime),
      });
    });

    it("should handle different date formats correctly", async () => {
      const dtoWithDifferentFormat: ListBlockSchedulingDTO = {
        userId: "user-123",
        startDate: "2025-01-01T10:00",
        endDate: "2025-01-01T18:00",
      };

      mockBlockSchedulingRepository.listBetweenDates.mockResolvedValue([]);

      await listBlockSchedulingUseCase.execute(dtoWithDifferentFormat);

      expect(
        mockBlockSchedulingRepository.listBetweenDates,
      ).toHaveBeenCalledWith({
        userId: dtoWithDifferentFormat.userId,
        startDate: expect.any(DateTime),
        endDate: expect.any(DateTime),
      });
    });

    it("should map BlockSchedule entities to BlockScheduleDto correctly", async () => {
      const blockScheduleWithDescription = new BlockSchedule({
        id: "block-3",
        startDate: new DateTime("2025-01-01T12:00:00Z"),
        endDate: new DateTime("2025-01-01T13:00:00Z"),
        description: "Consulta médica",
      });

      mockBlockSchedulingRepository.listBetweenDates.mockResolvedValue([
        blockScheduleWithDescription,
      ]);

      const result = await listBlockSchedulingUseCase.execute(validDTO);

      expect(result).toEqual([
        {
          id: "block-3",
          startDate: "2025-01-01T12:00",
          endDate: "2025-01-01T13:00",
          description: "Consulta médica",
        },
      ]);
    });

    it("should handle block schedule without description", async () => {
      const blockScheduleWithoutDescription = new BlockSchedule({
        id: "block-4",
        startDate: new DateTime("2025-01-01T16:00:00Z"),
        endDate: new DateTime("2025-01-01T17:00:00Z"),
      });

      mockBlockSchedulingRepository.listBetweenDates.mockResolvedValue([
        blockScheduleWithoutDescription,
      ]);

      const result = await listBlockSchedulingUseCase.execute(validDTO);

      expect(result).toEqual([
        {
          id: "block-4",
          startDate: "2025-01-01T16:00",
          endDate: "2025-01-01T17:00",
          description: undefined,
        },
      ]);
    });
  });
});
