import { IBeforeScheduleMessageRepository } from "../../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { BeforeScheduleMessageDTO } from "../../../models/BeforeScheduleMessage";
import { BeforeScheduleMessage } from "../../../models/BeforeScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type ListBeforeScheduleMessagesDTO = {
  userId: string;
  page?: number;
  limit?: number;
};

export type ListBeforeScheduleMessagesOutput = {
  items: BeforeScheduleMessageDTO[];
  total: number;
  page: number;
  limit: number;
};

export class ListBeforeScheduleMessagesUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
  ) {}

  async execute(
    dto: ListBeforeScheduleMessagesDTO,
  ): Promise<ListBeforeScheduleMessagesOutput> {
    const page = Math.max(1, Number(dto.page) || 1);
    const rawLimit = Number(dto.limit) || 20;
    const limit = Math.min(100, Math.max(1, rawLimit));
    const offset = (page - 1) * limit;

    const { items: configs, total } =
      await this.beforeScheduleMessageRepository.listByUserIdPaged({
        userId: dto.userId,
        limit,
        offset,
      });

    const items = configs.map((config) => {
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

    return { items, total, page, limit };
  }
}
