import { DateTime } from "../../shared/Date";
import { Entity } from "../../shared/Entity";

export type EventSuggestionDTO = {
  id?: string;
  description: string;
  durationInMinutes: number;
  frequency: number;
};

export class EventSuggestion extends Entity {
  readonly description: string;
  readonly durationInMinutes: number;
  private _frequency: number;

  constructor({
    description,
    durationInMinutes,
    frequency,
    id,
  }: EventSuggestionDTO) {
    super(id);
    this.description = description;
    this.durationInMinutes = durationInMinutes;
    this._frequency = frequency;
  }

  get frequency() {
    return this._frequency;
  }

  getDTO() {
    return {
      id: this.id,
      description: this.description,
      durationInMinutes: this.durationInMinutes,
      frequency: this.frequency,
    };
  }

  incrementFrequency() {
    this._frequency += 1;
  }
}

export function factoryEventSuggestionWithStartEndDate(data: {
  description: string;
  startDate: string; // pattern YYYY-MM-DDTHH:mm:ss
  endDate: string; // pattern YYYY-MM-DDTHH:mm:ss
}) {
  const start = new DateTime(data.startDate);
  const end = new DateTime(data.endDate);

  const differenceInMinutes = DateTime.difference(end, start) / 1000 / 60;
  return new EventSuggestion({
    description: data.description,
    durationInMinutes: differenceInMinutes,
    frequency: 1,
  });
}
