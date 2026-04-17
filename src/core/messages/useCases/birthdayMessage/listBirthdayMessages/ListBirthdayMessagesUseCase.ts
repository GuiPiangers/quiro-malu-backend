import { IBirthdayMessageRepository } from "../../../../../repositories/messages/IBirthdayMessageRepository";
import { BirthdayMessage, BirthdayMessageDTO } from "../../../models/BirthdayMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type ListBirthdayMessagesDTO = {
  userId: string;
  page?: number;
  limit?: number;
};

export type ListBirthdayMessagesOutput = {
  items: BirthdayMessageDTO[];
  total: number;
  page: number;
  limit: number;
};

export class ListBirthdayMessagesUseCase {
  constructor(private birthdayMessageRepository: IBirthdayMessageRepository) {}

  async execute(dto: ListBirthdayMessagesDTO): Promise<ListBirthdayMessagesOutput> {
    const page = Math.max(1, Number(dto.page) || 1);
    const rawLimit = Number(dto.limit) || 20;
    const limit = Math.min(100, Math.max(1, rawLimit));
    const offset = (page - 1) * limit;

    const { items: configs, total } = await this.birthdayMessageRepository.listByUserIdPaged({
      userId: dto.userId,
      limit,
      offset,
    });

    const items = configs.map((config) => {
      const messageTemplate = new MessageTemplate({
        textTemplate: config.textTemplate,
      });

      const birthdayMessage = new BirthdayMessage({
        id: config.id,
        name: config.name,
        sendTime: config.sendTime,
        isActive: config.isActive,
        messageTemplate,
      });

      return birthdayMessage.getDTO();
    });

    return { items, total, page, limit };
  }
}
