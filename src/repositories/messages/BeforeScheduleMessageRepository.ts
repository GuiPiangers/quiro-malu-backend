import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  BeforeScheduleMessageConfigDTO,
  GetBeforeScheduleMessageByIdProps,
  IBeforeScheduleMessageRepository,
  ListBeforeScheduleMessagesByUserIdProps,
  SaveBeforeScheduleMessageProps,
} from "./IBeforeScheduleMessageRepository";

export class BeforeScheduleMessageRepository
  implements IBeforeScheduleMessageRepository
{
  async save(data: SaveBeforeScheduleMessageProps): Promise<void> {
    try {
      await Knex(ETableNames.BEFORE_SCHEDULE_MESSAGES).insert(data);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async listAll(): Promise<BeforeScheduleMessageConfigDTO[]> {
    try {
      const rows = await Knex(ETableNames.BEFORE_SCHEDULE_MESSAGES).select(
        "id",
        "userId",
        "minutesBeforeSchedule",
        "textTemplate",
        "isActive",
      );

      return rows.map((row: BeforeScheduleMessageConfigDTO) => ({
        ...row,
        isActive: !!row.isActive,
      })) as BeforeScheduleMessageConfigDTO[];
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async listByUserId(
    data: ListBeforeScheduleMessagesByUserIdProps,
  ): Promise<BeforeScheduleMessageConfigDTO[]> {
    try {
      const rows = await Knex(ETableNames.BEFORE_SCHEDULE_MESSAGES)
        .select("id", "userId", "minutesBeforeSchedule", "textTemplate", "isActive")
        .where({
          userId: data.userId,
        });

      return rows.map((row: any) => ({
        ...row,
        isActive: !!row.isActive,
      })) as BeforeScheduleMessageConfigDTO[];
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getById(
    data: GetBeforeScheduleMessageByIdProps,
  ): Promise<BeforeScheduleMessageConfigDTO | null> {
    try {
      const row = await Knex(ETableNames.BEFORE_SCHEDULE_MESSAGES)
        .select(
          "id",
          "userId",
          "minutesBeforeSchedule",
          "textTemplate",
          "isActive",
        )
        .first()
        .where({
          id: data.id,
          userId: data.userId,
        });

      if (!row) return null;

      return {
        ...row,
        isActive: !!row.isActive,
      } as BeforeScheduleMessageConfigDTO;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
