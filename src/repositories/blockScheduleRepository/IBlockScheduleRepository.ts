import { BlockSchedule } from "../../core/scheduling/models/BlockSchedule";
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
}
