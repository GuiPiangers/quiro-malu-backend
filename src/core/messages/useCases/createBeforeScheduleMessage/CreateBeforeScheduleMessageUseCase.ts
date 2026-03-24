import {
  IBeforeScheduleMessageRepository,
  SaveBeforeScheduleMessageProps,
} from "../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { AppEventListener } from "../../../shared/observers/EventListener";
import {
  BeforeScheduleMessage,
  BeforeScheduleMessageDTO,
} from "../../models/BeforeScheduleMessage";
import { MessageTemplate } from "../../models/MessageTemplate";

export type CreateBeforeScheduleMessageDTO = {
  userId: string;
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
    const messageTemplate = new MessageTemplate({
      textTemplate: dto.messageTemplate.textTemplate,
    });

    const beforeScheduleMessage = new BeforeScheduleMessage({
      minutesBeforeSchedule: dto.minutesBeforeSchedule,
      messageTemplate,
      isActive: dto.isActive ?? true,
    });

    const beforeScheduleMessageDTO = beforeScheduleMessage.getDTO();

    const saveData: SaveBeforeScheduleMessageProps = {
      userId: dto.userId,
      id: beforeScheduleMessageDTO.id,
      minutesBeforeSchedule: beforeScheduleMessageDTO.minutesBeforeSchedule,
      textTemplate: beforeScheduleMessageDTO.messageTemplate.textTemplate,
      isActive: beforeScheduleMessageDTO.isActive,
    };

    await this.beforeScheduleMessageRepository.save(saveData);

    this.appEventListener.emit("beforeScheduleMessageCreate", {
      id: beforeScheduleMessageDTO.id!,
      userId: dto.userId,
      minutesBeforeSchedule: beforeScheduleMessageDTO.minutesBeforeSchedule,
      isActive: beforeScheduleMessageDTO.isActive,
    });

    return beforeScheduleMessageDTO;
  }
}
