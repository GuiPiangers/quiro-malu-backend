import { BlockSchedule } from "../../core/scheduling/models/BlockSchedule";
import { BlockScheduleDto } from "../../core/scheduling/models/dtos/BlockSchedule.dto";
import { DateTime } from "../../core/shared/Date";

export type BlockScheduleListBetweenDatesParams = {
  userId: string;
  startDate: DateTime;
  endDate: DateTime;
};

export type BlockScheduleDeleteParams = {
  id: string;
  userId: string;
};

export interface IBlockScheduleRepository {
  save(data: BlockSchedule, userId: string): Promise<void>;

  edit(data: BlockSchedule, userId: string): Promise<void>;

  findById(id: string, userId: string): Promise<BlockSchedule | null>;

  listBetweenDates(
    data: BlockScheduleListBetweenDatesParams,
  ): Promise<BlockSchedule[]>;

  list(data: {
    userId: string;
    date: string;
    config?: { limit: number; offSet: number };
  }): Promise<BlockScheduleDto[]>;

  count(data: BlockScheduleListBetweenDatesParams): Promise<{ total: number }>;

  delete(data: BlockScheduleDeleteParams): Promise<void>;
}
