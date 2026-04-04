import { IBeforeScheduleMessageRepository } from "../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { ApiError } from "../../../../utils/ApiError";
import { BeforeScheduleMessageDTO } from "../../models/BeforeScheduleMessage";
import { BeforeScheduleMessage } from "../../models/BeforeScheduleMessage";
import { MessageTemplate } from "../../models/MessageTemplate";

export type GetBeforeScheduleMessageDTO = {
  id: string;
  userId: string;
};

export class GetBeforeScheduleMessageUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
  ) {}

  async execute(dto: GetBeforeScheduleMessageDTO): Promise<BeforeScheduleMessageDTO> {
    const config = await this.beforeScheduleMessageRepository.getById({
      id: dto.id,
      userId: dto.userId,
    });

    if (!config) {
      throw new ApiError("Mensagem agendada não encontrada", 404);
    }

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
  }
}
