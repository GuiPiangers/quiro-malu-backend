import { Entity } from "../../shared/Entity";

export type EventSuggestionDTO = {
  id?: string;
  description: string;
  durationInMinutes: string;
  frequency: number;
};

export class EventSuggestion extends Entity {
  readonly description: string;
  readonly durationInMinutes: string;
  readonly frequency: number;

  constructor({
    description,
    durationInMinutes,
    frequency,
    id,
  }: EventSuggestionDTO) {
    super(id);
    this.description = description;
    this.durationInMinutes = durationInMinutes;
    this.frequency = frequency;
  }

  getDTO() {
    return {
      id: this.id,
      description: this.description,
      durationInMinutes: this.durationInMinutes,
      frequency: this.frequency,
    };
  }
}
