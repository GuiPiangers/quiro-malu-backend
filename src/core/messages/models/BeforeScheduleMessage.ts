import { ApiError } from "../../../utils/ApiError";
import { Entity } from "../../shared/Entity";
import { MessageTemplate, MessageTemplateDTO } from "./MessageTemplate";

export type BeforeScheduleMessageDTO = {
  id?: string;
  minutesBeforeSchedule: number;
  isActive: boolean;
  messageTemplate: MessageTemplateDTO;
};

export class BeforeScheduleMessage extends Entity {
  readonly minutesBeforeSchedule: number;
  readonly isActive: boolean;
  readonly messageTemplate: MessageTemplate;

  constructor({
    id,
    messageTemplate,
    minutesBeforeSchedule,
    isActive = true,
  }: {
    id?: string;
    minutesBeforeSchedule: number;
    messageTemplate: MessageTemplate;
    isActive?: boolean;
  }) {
    super(id);

    if (!Number.isInteger(minutesBeforeSchedule) || minutesBeforeSchedule <= 0) {
      throw new ApiError(
        "minutesBeforeSchedule deve ser um inteiro maior que zero",
        400,
        "minutesBeforeSchedule",
      );
    }

    if (typeof isActive !== "boolean") {
      throw new ApiError("isActive deve ser um booleano", 400, "isActive");
    }

    this.minutesBeforeSchedule = minutesBeforeSchedule;
    this.isActive = isActive;
    this.messageTemplate = messageTemplate;
  }

  getDTO(): BeforeScheduleMessageDTO {
    return {
      id: this.id,
      minutesBeforeSchedule: this.minutesBeforeSchedule,
      isActive: this.isActive,
      messageTemplate: this.messageTemplate.getDTO(),
    };
  }
}
