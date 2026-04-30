import type { Knex } from "knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  BeforeScheduleMessageConfigDTO,
  DeleteBeforeScheduleMessageProps,
  GetBeforeScheduleMessageByIdProps,
  IBeforeScheduleMessageRepository,
  ListBeforeScheduleMessagesByUserIdPagedProps,
  ListBeforeScheduleMessagesByUserIdProps,
  ListBeforeScheduleMessagesPagedResult,
  SaveBeforeScheduleMessageProps,
  UpdateBeforeScheduleMessageProps,
} from "./IBeforeScheduleMessageRepository";

export class BeforeScheduleMessageRepository
  implements IBeforeScheduleMessageRepository
{
  constructor(private readonly knex: Knex) {}

  async save(data: SaveBeforeScheduleMessageProps): Promise<void> {
    try {
      await this.knex(ETableNames.BEFORE_SCHEDULE_MESSAGES).insert(data);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async delete(data: DeleteBeforeScheduleMessageProps): Promise<void> {
    try {
      await this.knex(ETableNames.BEFORE_SCHEDULE_MESSAGES)
        .where({ id: data.id, userId: data.userId })
        .del();
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async update(data: UpdateBeforeScheduleMessageProps): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.minutesBeforeSchedule !== undefined)
        updateData.minutesBeforeSchedule = data.minutesBeforeSchedule;
      if (data.textTemplate !== undefined)
        updateData.textTemplate = data.textTemplate;
      if (data.isActive !== undefined)
        updateData.isActive = data.isActive;

      await this.knex(ETableNames.BEFORE_SCHEDULE_MESSAGES)
        .where({ id: data.id, userId: data.userId })
        .update(updateData);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async listAll(): Promise<BeforeScheduleMessageConfigDTO[]> {
    try {
      const rows = await this.knex(ETableNames.BEFORE_SCHEDULE_MESSAGES).select(
        "id",
        "userId",
        "name",
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
      const rows = await this.knex(ETableNames.BEFORE_SCHEDULE_MESSAGES)
        .select(
          "id",
          "userId",
          "name",
          "minutesBeforeSchedule",
          "textTemplate",
          "isActive",
        )
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

  async listByUserIdPaged(
    data: ListBeforeScheduleMessagesByUserIdPagedProps,
  ): Promise<ListBeforeScheduleMessagesPagedResult> {
    try {
      const base = () =>
        this.knex(ETableNames.BEFORE_SCHEDULE_MESSAGES).where({
          userId: data.userId,
        });

      const countRows = await base().clone().count("* as total");
      const total = Number(
        (Array.isArray(countRows) ? countRows[0] : countRows)?.total ?? 0,
      );

      const rows = await base()
        .clone()
        .select(
          "id",
          "userId",
          "name",
          "minutesBeforeSchedule",
          "textTemplate",
          "isActive",
        )
        .orderBy("updated_at", "desc")
        .limit(data.limit)
        .offset(data.offset);

      const items = rows.map((row: any) => ({
        ...row,
        isActive: !!row.isActive,
      })) as BeforeScheduleMessageConfigDTO[];

      return { items, total };
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getById(
    data: GetBeforeScheduleMessageByIdProps,
  ): Promise<BeforeScheduleMessageConfigDTO | null> {
    try {
      const row = await this.knex(ETableNames.BEFORE_SCHEDULE_MESSAGES)
        .select(
          "id",
          "userId",
          "name",
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
