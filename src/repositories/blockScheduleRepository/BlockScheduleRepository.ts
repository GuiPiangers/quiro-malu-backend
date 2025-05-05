import { BlockSchedule } from "../../core/scheduling/models/BlockSchedule";
import { ETableNames } from "../../database/ETableNames";
import { Knex } from "../../database/knex";
import { IBlockScheduleRepository } from "./IBlockScheduleRepository";

export class BlockScheduleRepository implements IBlockScheduleRepository {
  async save(
    { endDate, id, startDate, description }: BlockSchedule,
    userId: string,
  ): Promise<void> {
    Knex(ETableNames.BLOCK_SCHEDULES).insert({
      description,
      id,
      startDate,
      endDate,
      userId,
    });
  }
}
