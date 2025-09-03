import { createMockBlockScheduleRepository } from "../../../../../repositories/_mocks/BlockScheduleRepositoryMock";
import { DeleteBlockScheduleUseCase } from "./deleteBlockSchedule";
import { BlockSchedule } from "../../../models/BlockSchedule";
import { DateTime } from "../../../../shared/Date";
import { IBlockScheduleRepository } from "../../../../../repositories/blockScheduleRepository/IBlockScheduleRepository";

let blockScheduleRepositoryMock: jest.Mocked<IBlockScheduleRepository>;
let deleteBlockScheduleUseCase: DeleteBlockScheduleUseCase;

describe("DeleteBlockScheduleUseCase", () => {
  beforeEach(() => {
    blockScheduleRepositoryMock = createMockBlockScheduleRepository();
    deleteBlockScheduleUseCase = new DeleteBlockScheduleUseCase(
      blockScheduleRepositoryMock,
    );
  });

  it("should delete a block schedule", async () => {
    const blockSchedule = new BlockSchedule({
      id: "1",
      description: "Block schedule",
      date: new DateTime("2025-01-01T10:00:00"),
      endDate: new DateTime("2025-01-01T12:00:00"),
    });

    blockScheduleRepositoryMock.findById.mockResolvedValue(blockSchedule);

    await deleteBlockScheduleUseCase.execute({ id: "1", userId: "1" });

    expect(blockScheduleRepositoryMock.delete).toHaveBeenCalledWith({
      id: "1",
      userId: "1",
    });
  });
});
