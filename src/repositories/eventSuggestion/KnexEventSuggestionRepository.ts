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
  async getByDescription(params: {
    description: string;
    userId: string;
  }): Promise<EventSuggestion | null> {
    const { description, userId } = params;
    const result = await Knex(ETableNames.EVENT_SUGGESTIONS)
      .select<EventSuggestionDTO>()
      .where({ description, userId })
      .first();

    if (!result) return null;

    return new EventSuggestion(result);
  }

  async update(
    eventSuggestion: EventSuggestion,
    userId: string,
  ): Promise<void> {
    await Knex(ETableNames.EVENT_SUGGESTIONS)
      .update(eventSuggestion.getDTO())
      .where({ id: eventSuggestion.id, userId });
  }

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
