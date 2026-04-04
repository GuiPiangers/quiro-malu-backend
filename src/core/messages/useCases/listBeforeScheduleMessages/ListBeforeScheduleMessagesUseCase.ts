import { IBeforeScheduleMessageRepository } from "../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { BeforeScheduleMessageDTO } from "../../models/BeforeScheduleMessage";
import { BeforeScheduleMessage } from "../../models/BeforeScheduleMessage";
import { MessageTemplate } from "../../models/MessageTemplate";

export type ListBeforeScheduleMessagesDTO = {
  userId: string;
};

export class ListBeforeScheduleMessagesUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
  ) {}

  async execute(dto: ListBeforeScheduleMessagesDTO): Promise<BeforeScheduleMessageDTO[]> {
    const configs = await this.beforeScheduleMessageRepository.listByUserId({
      userId: dto.userId,
    });

    return configs.map((config) => {
      const messageTemplate = new MessageTemplate({
        textTemplate: config.textTemplate,
      });

      const beforeScheduleMessage = new BeforeScheduleMessage({
        id: config.id,
        name: config.name,
        minutesBeforeSchedule: config.minutesBeforeSchedule,
        isActive: config.isActive,
        messageTemplate,
      });

      return beforeScheduleMessage.getDTO();
    });
  }
}
