import { BlockSchedule } from "../../core/scheduling/models/BlockSchedule";
import { ETableNames } from "../../database/ETableNames";
import { Knex } from "../../database/knex";
import {
  BlockScheduleListBetweenDatesParams,
  IBlockScheduleRepository,
} from "./IBlockScheduleRepository";

export class BlockScheduleRepository implements IBlockScheduleRepository {
  listBetweenDates(
    data: BlockScheduleListBetweenDatesParams,
  ): Promise<BlockSchedule[]> {
    throw new Error("Method not implemented.");
  }

  async save(
    { endDate, id, startDate, description }: BlockSchedule,
    userId: string,
  ): Promise<void> {
    await Knex(ETableNames.BLOCK_SCHEDULES).insert({
      description,
      id,
      startDate: startDate.dateTime,
      endDate: endDate.dateTime,
      userId,
    });
  }
}
