import {
  EventSuggestion,
  EventSuggestionDTO,
} from "../../core/scheduling/models/EventSuggestion";
import { ETableNames } from "../../database/ETableNames";
import { Knex } from "../../database/knex";
import { IEventSuggestionRepository } from "./IEventSuggestionRepository";

export class KnexEventSuggestionRepository
  implements IEventSuggestionRepository
{
  async save(eventSuggestion: EventSuggestion, userId: string): Promise<void> {
    await Knex(ETableNames.EVENT_SUGGESTIONS).insert({
      ...eventSuggestion.getDTO(),
      userId,
    });
  }

  async list(params: {
    userId: string;
    config?: { filter?: string };
  }): Promise<EventSuggestion[]> {
    const { userId, config } = params;

    const query = Knex(ETableNames.EVENT_SUGGESTIONS)
      .select<EventSuggestionDTO[]>()
      .where({ userId })
      .orderBy("frequency", "desc")
      .limit(10);

    if (config?.filter) {
      query.andWhere("description", "like", `%${config.filter}%`);
    }

    const result = await query;

    return result.map((dto) => new EventSuggestion(dto));
  }
}
