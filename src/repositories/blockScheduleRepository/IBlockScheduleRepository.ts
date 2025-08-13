import { BlockSchedule } from "../../core/scheduling/models/BlockSchedule";
import { BlockScheduleDto } from "../../core/scheduling/models/dtos/BlockSchedule.dto";
import { DateTime } from "../../core/shared/Date";

export type BlockScheduleListBetweenDatesParams = {
  userId: string;
  startDate: DateTime;
  endDate: DateTime;
};

export interface IBlockScheduleRepository {
  save(data: BlockSchedule, userId: string): Promise<void>;

  listBetweenDates(
    data: BlockScheduleListBetweenDatesParams,
  ): Promise<BlockSchedule[]>;

  list(data: {
    userId: string;
    date: string;
    config?: { limit: number; offSet: number };
  }): Promise<BlockScheduleDto[]>;
}
