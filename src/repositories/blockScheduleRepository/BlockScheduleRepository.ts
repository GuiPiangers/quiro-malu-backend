import { BlockSchedule } from "../../core/scheduling/models/BlockSchedule";
import { ETableNames } from "../../database/ETableNames";
import { Knex } from "../../database/knex";
import {
  BlockScheduleListBetweenDatesParams,
  IBlockScheduleRepository,
} from "./IBlockScheduleRepository";

export class BlockScheduleRepository implements IBlockScheduleRepository {
  async listBetweenDates({
    endDate,
    startDate,
    userId,
  }: BlockScheduleListBetweenDatesParams): Promise<BlockSchedule[]> {
    const blockSchedulesDto = await Knex(ETableNames.BLOCK_SCHEDULES)
      .select(
        "id",
        "userId",
        "description",
        Knex.raw(`DATE_FORMAT(startDate, '%Y-%m-%dT%H:%i') as startDate`),
        Knex.raw(`DATE_FORMAT(endDate, '%Y-%m-%dT%H:%i') as endDate`),
      )
      .where("userId", userId)
      .andWhere((qb) => {
        qb.whereBetween("startDate", [
          startDate.dateTime,
          endDate.dateTime,
        ]).orWhereBetween("endDate", [startDate.dateTime, endDate.dateTime]);
      });

    return blockSchedulesDto.map(
      (blockSchedule) => new BlockSchedule(blockSchedule),
    );
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
