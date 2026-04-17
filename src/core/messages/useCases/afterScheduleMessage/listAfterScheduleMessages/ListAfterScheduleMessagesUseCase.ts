import { IAfterScheduleMessageRepository } from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { AfterScheduleMessageDTO, AfterScheduleMessage } from "../../../models/AfterScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type ListAfterScheduleMessagesDTO = {
  userId: string;
  page?: number;
  limit?: number;
};

export type ListAfterScheduleMessagesOutput = {
  items: AfterScheduleMessageDTO[];
  total: number;
  page: number;
  limit: number;
};

export class ListAfterScheduleMessagesUseCase {
  constructor(
    private afterScheduleMessageRepository: IAfterScheduleMessageRepository,
  ) {}

  async execute(
    dto: ListAfterScheduleMessagesDTO,
  ): Promise<ListAfterScheduleMessagesOutput> {
    const page = Math.max(1, Number(dto.page) || 1);
    const rawLimit = Number(dto.limit) || 20;
    const limit = Math.min(100, Math.max(1, rawLimit));
    const offset = (page - 1) * limit;

    const { items: configs, total } =
      await this.afterScheduleMessageRepository.listByUserIdPaged({
        userId: dto.userId,
        limit,
        offset,
      });

    const items = configs.map((config) => {
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

    return { items, total, page, limit };
  }
}
