import { IBirthdayMessageRepository } from "../../../../../repositories/messages/IBirthdayMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { BirthdayMessage, BirthdayMessageDTO } from "../../../models/BirthdayMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type GetBirthdayMessageDTO = {
  id: string;
  userId: string;
};

export class GetBirthdayMessageUseCase {
  constructor(private birthdayMessageRepository: IBirthdayMessageRepository) {}

  async execute(dto: GetBirthdayMessageDTO): Promise<BirthdayMessageDTO> {
    const config = await this.birthdayMessageRepository.getById({
      id: dto.id,
      userId: dto.userId,
    });

    if (!config) {
      throw new ApiError("Campanha de aniversário não encontrada", 404);
    }

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
  }
}
