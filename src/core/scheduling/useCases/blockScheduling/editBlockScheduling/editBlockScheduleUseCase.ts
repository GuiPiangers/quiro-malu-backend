import { BlockSchedule } from "../../../models/BlockSchedule";
import { IBlockScheduleRepository } from "../../../../../repositories/blockScheduleRepository/IBlockScheduleRepository";
import { ISchedulingRepository } from "../../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { DateTime } from "../../../../shared/Date";
import { BlockScheduleDto } from "../../../models/dtos/BlockSchedule.dto";

export type EditBlockScheduleDTO = Partial<BlockScheduleDto> & { id: string };

export class EditBlockScheduleUseCase {
  constructor(
    private blockScheduleRepository: IBlockScheduleRepository,
    private schedulingRepository: ISchedulingRepository,
  ) {}

  async execute(dto: EditBlockScheduleDTO, userId: string) {
    const { id, date, endDate, description } = dto;

    const blockSchedule = await this.blockScheduleRepository.findById(
      id,
      userId,
    );

    if (!blockSchedule) {
      throw new ApiError("Agendamento não encontrado");
    }

    const newDate = date ? new DateTime(date) : blockSchedule.date;
    const newEndDate = endDate ? new DateTime(endDate) : blockSchedule.endDate;

    const updatedBlockSchedule = new BlockSchedule({
      id,
      date: newDate,
      endDate: newEndDate,
      description: description ?? blockSchedule.description,
    });

    if (date || endDate) {
      const schedules = await this.schedulingRepository.listBetweenDates({
        userId,
        startDate: newDate,
        endDate: newEndDate,
      });

      for (const schedule of schedules) {
        if (updatedBlockSchedule.overlapsWithSchedule(schedule)) {
          throw new ApiError(
            "O horário selecionado para o bloqueio está indisponível.",
          );
        }
      }

      const blockSchedules =
        await this.blockScheduleRepository.listBetweenDates({
          userId,
          startDate: newDate,
          endDate: newEndDate,
        });

      for (const otherBlockSchedule of blockSchedules) {
        if (otherBlockSchedule.id === id) continue;
        if (
          updatedBlockSchedule.overlapsWithBlockSchedule(otherBlockSchedule)
        ) {
          throw new ApiError(
            "O horário selecionado para o bloqueio está indisponível.",
          );
        }
      }
    }

    await this.blockScheduleRepository.edit(updatedBlockSchedule, userId);
  }
}
