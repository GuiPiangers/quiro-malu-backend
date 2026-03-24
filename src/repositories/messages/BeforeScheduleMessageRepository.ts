import { Knex } from "../../database/knex";
import { ETableNames } from "../../database/ETableNames";
import { ApiError } from "../../utils/ApiError";
import {
  IBeforeScheduleMessageRepository,
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
}
