import { BlockSchedule } from "../../core/scheduling/models/BlockSchedule";
import { ETableNames } from "../../database/ETableNames";
import { Knex } from "../../database/knex";
import {
  BlockScheduleDeleteParams,
  BlockScheduleListBetweenDatesParams,
  IBlockScheduleRepository,
} from "./IBlockScheduleRepository";
import { BlockScheduleDto } from "../../core/scheduling/models/dtos/BlockSchedule.dto";
import { DateTime } from "../../core/shared/Date";

export class BlockScheduleRepository implements IBlockScheduleRepository {
  async delete({ id, userId }: BlockScheduleDeleteParams): Promise<void> {
    await Knex(ETableNames.BLOCK_SCHEDULES).where({ userId, id }).del();
  }

  async edit(
    { endDate, id, date: startDate, description }: BlockSchedule,
    userId: string,
  ): Promise<void> {
    await Knex(ETableNames.BLOCK_SCHEDULES)
      .update({
        description,
        startDate: startDate.dateTime,
        endDate: endDate.dateTime,
      })
      .where("id", id)
      .andWhere("userId", userId);
  }

  async findById(id: string, userId: string): Promise<BlockSchedule | null> {
    const blockSchedulesDto: BlockScheduleDto | null = await Knex(
      ETableNames.BLOCK_SCHEDULES,
    )
      .select(
        "id",
        "userId",
        "description",
        Knex.raw(`DATE_FORMAT(startDate, '%Y-%m-%dT%H:%i') as date`),
        Knex.raw(`DATE_FORMAT(endDate, '%Y-%m-%dT%H:%i') as endDate`),
      )
      .first()
      .where({
        userId,
        id,
      });

    if (!blockSchedulesDto) return null;

    const date = new DateTime(blockSchedulesDto.date);
    const endDate = new DateTime(blockSchedulesDto.endDate);

    return new BlockSchedule({ ...blockSchedulesDto, date, endDate });
  }

  async count({
    endDate,
    startDate,
    userId,
  }: BlockScheduleListBetweenDatesParams): Promise<{ total: number }> {
    const result = await Knex(ETableNames.BLOCK_SCHEDULES)
      .count("id")
      .where("userId", userId)
      .andWhereBetween("startDate", [startDate.dateTime, endDate.dateTime])
      .andWhereBetween("endDate", [startDate.dateTime, endDate.dateTime])
      .first();

    return {
      total: Number(result?.total) || 0,
    };
  }

  async listBetweenDates({
    endDate,
    startDate,
    userId,
  }: BlockScheduleListBetweenDatesParams): Promise<BlockSchedule[]> {
    const blockSchedulesDto: BlockScheduleDto[] = await Knex(
      ETableNames.BLOCK_SCHEDULES,
    )
      .select(
        "id",
        "userId",
        "description",
        Knex.raw(`DATE_FORMAT(startDate, '%Y-%m-%dT%H:%i') as date`),
        Knex.raw(`DATE_FORMAT(endDate, '%Y-%m-%dT%H:%i') as endDate`),
      )
      .where("userId", userId)
      .andWhere((qb) => {
        qb.whereBetween("startDate", [startDate.dateTime, endDate.dateTime])
          .orWhereBetween("endDate", [startDate.dateTime, endDate.dateTime])
          .orWhere((subQb) => {
            subQb
              .where("startDate", "<=", startDate.dateTime)
              .andWhere("endDate", ">=", startDate.dateTime);
          });
      });

    return blockSchedulesDto.map(
      (blockSchedule) =>
        new BlockSchedule({
          ...blockSchedule,
          date: new DateTime(blockSchedule.date),
          endDate: new DateTime(blockSchedule.endDate),
        }),
    );
  }

  async list(data: {
    userId: string;
    date: string;
    config?: { limit: number; offSet: number };
  }): Promise<BlockScheduleDto[]> {
    const { userId, date, config } = data;

    const query = Knex(ETableNames.BLOCK_SCHEDULES)
      .select(
        "id",
        "userId",
        "description",
        Knex.raw(`DATE_FORMAT(startDate, '%Y-%m-%dT%H:%i') as startDate`),
        Knex.raw(`DATE_FORMAT(endDate, '%Y-%m-%dT%H:%i') as endDate`),
      )
      .where("userId", userId)
      .andWhere((qb) => {
        qb.where("startDate", ">=", date)
          .orWhere("endDate", "<=", date)
          .orWhere((subQb) => {
            subQb
              .where("startDate", "<=", date)
              .andWhere("endDate", ">=", date);
          });
      });

    if (config) {
      return query.limit(config.limit).offset(config.offSet);
    }

    return query;
  }

  async save(
    { endDate, id, date: startDate, description }: BlockSchedule,
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
