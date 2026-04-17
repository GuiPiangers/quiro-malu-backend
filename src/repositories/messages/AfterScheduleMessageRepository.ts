import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  AfterScheduleMessageConfigDTO,
  DeleteAfterScheduleMessageProps,
  GetAfterScheduleMessageByIdProps,
  IAfterScheduleMessageRepository,
  ListAfterScheduleMessagesByUserIdProps,
  SaveAfterScheduleMessageProps,
  UpdateAfterScheduleMessageProps,
} from "./IAfterScheduleMessageRepository";

export class AfterScheduleMessageRepository
  implements IAfterScheduleMessageRepository
{
  async save(data: SaveAfterScheduleMessageProps): Promise<void> {
    try {
      await Knex(ETableNames.AFTER_SCHEDULE_MESSAGES).insert(data);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async delete(data: DeleteAfterScheduleMessageProps): Promise<void> {
    try {
      await Knex(ETableNames.AFTER_SCHEDULE_MESSAGES)
        .where({ id: data.id, userId: data.userId })
        .del();
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async update(data: UpdateAfterScheduleMessageProps): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.minutesAfterSchedule !== undefined)
        updateData.minutesAfterSchedule = data.minutesAfterSchedule;
      if (data.textTemplate !== undefined)
        updateData.textTemplate = data.textTemplate;
      if (data.isActive !== undefined)
        updateData.isActive = data.isActive;

      await Knex(ETableNames.AFTER_SCHEDULE_MESSAGES)
        .where({ id: data.id, userId: data.userId })
        .update(updateData);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async listAll(): Promise<AfterScheduleMessageConfigDTO[]> {
    try {
      const rows = await Knex(ETableNames.AFTER_SCHEDULE_MESSAGES).select(
        "id",
        "userId",
        "name",
        "minutesAfterSchedule",
        "textTemplate",
        "isActive",
      );

      return rows.map((row: AfterScheduleMessageConfigDTO) => ({
        ...row,
        isActive: !!row.isActive,
      })) as AfterScheduleMessageConfigDTO[];
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async listByUserId(
    data: ListAfterScheduleMessagesByUserIdProps,
  ): Promise<AfterScheduleMessageConfigDTO[]> {
    try {
      const rows = await Knex(ETableNames.AFTER_SCHEDULE_MESSAGES)
        .select(
          "id",
          "userId",
          "name",
          "minutesAfterSchedule",
          "textTemplate",
          "isActive",
        )
        .where({ userId: data.userId });

      return rows.map((row: any) => ({
        ...row,
        isActive: !!row.isActive,
      })) as AfterScheduleMessageConfigDTO[];
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getById(
    data: GetAfterScheduleMessageByIdProps,
  ): Promise<AfterScheduleMessageConfigDTO | null> {
    try {
      const row = await Knex(ETableNames.AFTER_SCHEDULE_MESSAGES)
        .select(
          "id",
          "userId",
          "name",
          "minutesAfterSchedule",
          "textTemplate",
          "isActive",
        )
        .first()
        .where({ id: data.id, userId: data.userId });

      if (!row) return null;

      return {
        ...row,
        isActive: !!(row as any).isActive,
      } as AfterScheduleMessageConfigDTO;
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
