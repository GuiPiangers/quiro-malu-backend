import {
  IBeforeScheduleMessageRepository,
  SaveBeforeScheduleMessageProps,
} from "../../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import {
  BeforeScheduleMessage,
  BeforeScheduleMessageDTO,
} from "../../../models/BeforeScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type CreateBeforeScheduleMessageDTO = {
  userId: string;
  name: string;
  minutesBeforeSchedule: number;
  isActive?: boolean;
  messageTemplate: {
    textTemplate: string;
  };
};

export class CreateBeforeScheduleMessageUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute(
    dto: CreateBeforeScheduleMessageDTO,
  ): Promise<BeforeScheduleMessageDTO> {
    const name = typeof dto.name === "string" ? dto.name.trim() : "";

    const messageTemplate = new MessageTemplate({
      textTemplate: dto.messageTemplate.textTemplate,
    });

    const beforeScheduleMessage = new BeforeScheduleMessage({
      name,
      minutesBeforeSchedule: dto.minutesBeforeSchedule,
      messageTemplate,
      isActive: dto.isActive ?? true,
    });

    const beforeScheduleMessageDTO = beforeScheduleMessage.getDTO();

    const saveData: SaveBeforeScheduleMessageProps = {
      userId: dto.userId,
      id: beforeScheduleMessageDTO.id,
      name: beforeScheduleMessageDTO.name,
      minutesBeforeSchedule: beforeScheduleMessageDTO.minutesBeforeSchedule,
      textTemplate: beforeScheduleMessageDTO.messageTemplate.textTemplate,
      isActive: beforeScheduleMessageDTO.isActive,
    };

    await this.beforeScheduleMessageRepository.save(saveData);

    this.appEventListener.emit("beforeScheduleMessageCreate", {
      id: beforeScheduleMessageDTO.id!,
      userId: dto.userId,
      name: beforeScheduleMessageDTO.name,
      minutesBeforeSchedule: beforeScheduleMessageDTO.minutesBeforeSchedule,
      isActive: beforeScheduleMessageDTO.isActive,
    });

    return beforeScheduleMessageDTO;
  }
}
