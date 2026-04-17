import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  BirthdayMessageCampaignDTO,
  GetBirthdayMessageByIdProps,
  IBirthdayMessageRepository,
  ListBirthdayMessagesByUserIdProps,
  ListBirthdayMessagesResult,
  SaveBirthdayMessageProps,
  UpdateBirthdayMessageProps,
} from "./IBirthdayMessageRepository";

function mapSendTimeToHhMm(value: unknown): string {
  if (value == null || value === "") return "09:00";
  if (typeof value === "string") {
    const m = value.match(/^(\d{1,2}):(\d{2})/);
    if (m) {
      return `${String(Number(m[1])).padStart(2, "0")}:${String(Number(m[2])).padStart(2, "0")}`;
    }
  }
  return "09:00";
}

export class BirthdayMessageRepository implements IBirthdayMessageRepository {
  async save(data: SaveBirthdayMessageProps): Promise<void> {
    try {
      await Knex(ETableNames.BIRTHDAY_MESSAGES).insert(data);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async getById(
    data: GetBirthdayMessageByIdProps,
  ): Promise<BirthdayMessageCampaignDTO | null> {
    try {
      const row = await Knex(ETableNames.BIRTHDAY_MESSAGES)
        .select("id", "userId", "name", "textTemplate", "isActive", "sendTime")
        .where({ id: data.id, userId: data.userId })
        .first();

      if (!row) return null;

      return {
        id: row.id,
        userId: row.userId,
        name: row.name,
        textTemplate: row.textTemplate,
        isActive: !!row.isActive,
        sendTime: mapSendTimeToHhMm(row.sendTime),
      };
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async update(data: UpdateBirthdayMessageProps): Promise<void> {
    try {
      const updateData: Record<string, unknown> = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.textTemplate !== undefined) updateData.textTemplate = data.textTemplate;
      if (data.isActive !== undefined) updateData.isActive = data.isActive;
      if (data.sendTime !== undefined) updateData.sendTime = data.sendTime;

      if (Object.keys(updateData).length === 0) {
        return;
      }

      await Knex(ETableNames.BIRTHDAY_MESSAGES)
        .where({ id: data.id, userId: data.userId })
        .update(updateData);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async findActiveByUserId(
    userId: string,
  ): Promise<BirthdayMessageCampaignDTO | null> {
    try {
      const row = await Knex(ETableNames.BIRTHDAY_MESSAGES)
        .where({ userId, isActive: true })
        .orderBy("updated_at", "desc")
        .first();

      if (!row) return null;

      return {
        id: row.id,
        userId: row.userId,
        name: row.name,
        textTemplate: row.textTemplate,
        isActive: !!row.isActive,
        sendTime: mapSendTimeToHhMm(row.sendTime),
      };
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }

  async listByUserIdPaged(
    data: ListBirthdayMessagesByUserIdProps,
  ): Promise<ListBirthdayMessagesResult> {
    try {
      const base = () =>
        Knex(ETableNames.BIRTHDAY_MESSAGES).where({ userId: data.userId });

      const countRows = await base().clone().count<{ total: string | number }>(
        "* as total",
      );
      const total = Number(
        (Array.isArray(countRows) ? countRows[0] : countRows)?.total ?? 0,
      );

      const rows = await base()
        .clone()
        .select("id", "userId", "name", "textTemplate", "isActive", "sendTime")
        .orderBy("updated_at", "desc")
        .limit(data.limit)
        .offset(data.offset);

      const items: BirthdayMessageCampaignDTO[] = rows.map((row) => ({
        id: row.id,
        userId: row.userId,
        name: row.name,
        textTemplate: row.textTemplate,
        isActive: !!row.isActive,
        sendTime: mapSendTimeToHhMm(row.sendTime),
      }));

      return { items, total };
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
