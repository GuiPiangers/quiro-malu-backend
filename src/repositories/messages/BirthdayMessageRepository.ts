import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  BirthdayMessageCampaignDTO,
  IBirthdayMessageRepository,
  ListBirthdayMessagesByUserIdProps,
  ListBirthdayMessagesResult,
  SaveBirthdayMessageProps,
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
