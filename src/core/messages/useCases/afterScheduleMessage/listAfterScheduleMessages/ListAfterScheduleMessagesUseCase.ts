import { IAfterScheduleMessageRepository } from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { AfterScheduleMessageDTO, AfterScheduleMessage } from "../../../models/AfterScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type ListAfterScheduleMessagesDTO = {
  userId: string;
};

export class ListAfterScheduleMessagesUseCase {
  constructor(
    private afterScheduleMessageRepository: IAfterScheduleMessageRepository,
  ) {}

  async execute(dto: ListAfterScheduleMessagesDTO): Promise<AfterScheduleMessageDTO[]> {
    const configs = await this.afterScheduleMessageRepository.listByUserId({
      userId: dto.userId,
    });

    return configs.map((config) => {
      const messageTemplate = new MessageTemplate({
        textTemplate: config.textTemplate,
      });

      const afterScheduleMessage = new AfterScheduleMessage({
        id: config.id,
        name: config.name,
        minutesAfterSchedule: config.minutesAfterSchedule,
        isActive: config.isActive,
        messageTemplate,
      });

      return afterScheduleMessage.getDTO();
    });
  }
}
