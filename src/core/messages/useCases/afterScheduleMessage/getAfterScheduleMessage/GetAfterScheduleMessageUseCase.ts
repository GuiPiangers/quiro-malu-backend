import { IAfterScheduleMessageRepository } from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AfterScheduleMessageDTO, AfterScheduleMessage } from "../../../models/AfterScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type GetAfterScheduleMessageDTO = {
  id: string;
  userId: string;
};

export class GetAfterScheduleMessageUseCase {
  constructor(
    private afterScheduleMessageRepository: IAfterScheduleMessageRepository,
  ) {}

  async execute(dto: GetAfterScheduleMessageDTO): Promise<AfterScheduleMessageDTO> {
    const config = await this.afterScheduleMessageRepository.getById({
      id: dto.id,
      userId: dto.userId,
    });

    if (!config) {
      throw new ApiError("Mensagem agendada não encontrada", 404);
    }

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
  }
}
