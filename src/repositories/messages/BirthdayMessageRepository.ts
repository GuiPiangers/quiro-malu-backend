import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  IBirthdayMessageRepository,
  SaveBirthdayMessageProps,
} from "./IBirthdayMessageRepository";

export class BirthdayMessageRepository implements IBirthdayMessageRepository {
  async save(data: SaveBirthdayMessageProps): Promise<void> {
    try {
      await Knex(ETableNames.BIRTHDAY_MESSAGES).insert(data);
    } catch (error: any) {
      throw new ApiError(error.message, 500);
    }
  }
}
