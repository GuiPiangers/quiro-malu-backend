import { IAfterScheduleMessageRepository } from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import {
  AfterScheduleMessage,
  AfterScheduleMessageDTO,
} from "../../../models/AfterScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type UpdateAfterScheduleMessageDTO = {
  id: string;
  userId: string;
  name?: string;
  minutesAfterSchedule?: number;
  isActive?: boolean;
  messageTemplate?: {
    textTemplate: string;
  };
};

export class UpdateAfterScheduleMessageUseCase {
  constructor(
    private afterScheduleMessageRepository: IAfterScheduleMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute(dto: UpdateAfterScheduleMessageDTO): Promise<AfterScheduleMessageDTO> {
    const existing = await this.afterScheduleMessageRepository.getById({
      id: dto.id,
      userId: dto.userId,
    });

    if (!existing) {
      throw new ApiError("Mensagem agendada não encontrada", 404);
    }

    const name = dto.name ?? existing.name;
    const minutesAfterSchedule =
      dto.minutesAfterSchedule ?? existing.minutesAfterSchedule;
    const isActive = dto.isActive ?? existing.isActive;
    const textTemplate =
      dto.messageTemplate?.textTemplate ?? existing.textTemplate;

    const messageTemplate = new MessageTemplate({ textTemplate });
    const afterScheduleMessage = new AfterScheduleMessage({
      id: existing.id,
      name,
      minutesAfterSchedule,
      messageTemplate,
      isActive,
    });

    const updateDTO = afterScheduleMessage.getDTO();

    await this.afterScheduleMessageRepository.update({
      id: dto.id,
      userId: dto.userId,
      name: updateDTO.name ?? undefined,
      minutesAfterSchedule: updateDTO.minutesAfterSchedule,
      textTemplate: updateDTO.messageTemplate?.textTemplate,
      isActive: updateDTO.isActive,
    });

    const updatedDTO = afterScheduleMessage.getDTO();

    this.appEventListener.emit("afterScheduleMessageUpdate", {
      id: updatedDTO.id!,
      userId: dto.userId,
      name: updatedDTO.name,
      minutesAfterSchedule: updatedDTO.minutesAfterSchedule,
      isActive: updatedDTO.isActive,
    });

    return updatedDTO;
  }
}
