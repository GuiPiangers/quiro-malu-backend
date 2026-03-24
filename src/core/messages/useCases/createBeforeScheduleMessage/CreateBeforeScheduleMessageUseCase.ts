import {
  IBeforeScheduleMessageRepository,
  SaveBeforeScheduleMessageProps,
} from "../../../../repositories/messages/IBeforeScheduleMessageRepository";
import {
  BeforeScheduleMessage,
  BeforeScheduleMessageDTO,
} from "../../models/BeforeScheduleMessage";
import { MessageTemplate } from "../../models/MessageTemplate";

export type CreateBeforeScheduleMessageDTO = {
  userId: string;
  minutesBeforeSchedule: number;
  messageTemplate: {
    textTemplate: string;
  };
};

export class CreateBeforeScheduleMessageUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
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
    });

    const beforeScheduleMessageDTO = beforeScheduleMessage.getDTO();

    const saveData: SaveBeforeScheduleMessageProps = {
      userId: dto.userId,
      id: beforeScheduleMessageDTO.id,
      minutesBeforeSchedule: beforeScheduleMessageDTO.minutesBeforeSchedule,
      textTemplate: beforeScheduleMessageDTO.messageTemplate.textTemplate,
    };

    await this.beforeScheduleMessageRepository.save(saveData);

    return beforeScheduleMessageDTO;
  }
}
