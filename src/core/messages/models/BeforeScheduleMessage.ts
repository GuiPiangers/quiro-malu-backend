import { ApiError } from "../../../utils/ApiError";
import { Entity } from "../../shared/Entity";
import { MessageTemplate, MessageTemplateDTO } from "./MessageTemplate";

export type BeforeScheduleMessageDTO = {
  id?: string;
  minutesBeforeSchedule: number;
  messageTemplate: MessageTemplateDTO;
};

export class BeforeScheduleMessage extends Entity {
  readonly minutesBeforeSchedule: number;
  readonly messageTemplate: MessageTemplate;

  constructor({
    id,
    messageTemplate,
    minutesBeforeSchedule,
  }: {
    id?: string;
    minutesBeforeSchedule: number;
    messageTemplate: MessageTemplate;
  }) {
    super(id);

    if (!Number.isInteger(minutesBeforeSchedule) || minutesBeforeSchedule <= 0) {
      throw new ApiError(
        "minutesBeforeSchedule deve ser um inteiro maior que zero",
        400,
        "minutesBeforeSchedule",
      );
    }

    this.minutesBeforeSchedule = minutesBeforeSchedule;
    this.messageTemplate = messageTemplate;
  }

  getDTO(): BeforeScheduleMessageDTO {
    return {
      id: this.id,
      minutesBeforeSchedule: this.minutesBeforeSchedule,
      messageTemplate: this.messageTemplate.getDTO(),
    };
  }
}
