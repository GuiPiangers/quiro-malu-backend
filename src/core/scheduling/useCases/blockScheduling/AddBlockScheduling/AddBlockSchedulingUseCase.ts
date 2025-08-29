import { IBlockScheduleRepository } from "../../../../../repositories/blockScheduleRepository/IBlockScheduleRepository";
import { ISchedulingRepository } from "../../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { DateTime } from "../../../../shared/Date";
import { BlockSchedule } from "../../../models/BlockSchedule";

export interface AddBlockSchedulingDTO {
  description?: string;
  startDate: string;
  endDate: string;
  userId: string;
}

export class AddBlockSchedulingUseCase {
  constructor(
    private blockSchedulingRepository: IBlockScheduleRepository,
    private schedulingRepository: ISchedulingRepository,
  ) {}

  async execute(blockSchedulingDTO: AddBlockSchedulingDTO) {
    const startDate = new DateTime(blockSchedulingDTO.startDate);
    const endDate = new DateTime(blockSchedulingDTO.endDate);

    const schedules = await this.schedulingRepository.listBetweenDates({
      endDate,
      startDate,
      userId: blockSchedulingDTO.userId,
    });

    const blockSchedules =
      await this.blockSchedulingRepository.listBetweenDates({
        endDate,
        startDate,
        userId: blockSchedulingDTO.userId,
      });

    const blockScheduling = new BlockSchedule({
      date: startDate,
      endDate,
      description: blockSchedulingDTO.description,
    });

    const hasOverlapsWithSchedule = schedules?.some((scheduling) => {
      return blockScheduling.overlapsWithSchedule(scheduling);
    });

    const hasOverlapsWithBlockSchedule = blockSchedules?.some(
      (blockSchedule) => {
        return blockSchedule.overlapsWithBlockSchedule(blockScheduling);
      },
    );

    if (hasOverlapsWithSchedule)
      throw new ApiError(
        "Existe agendamentos marcados no horário que deseja bloquear",
      );

    console.log("overlapse", hasOverlapsWithBlockSchedule);

    if (hasOverlapsWithBlockSchedule)
      throw new ApiError(
        "Existe agendamentos marcados no horário que deseja bloquear",
      );

    await this.blockSchedulingRepository.save(
      blockScheduling,
      blockSchedulingDTO.userId,
    );
  }
}
