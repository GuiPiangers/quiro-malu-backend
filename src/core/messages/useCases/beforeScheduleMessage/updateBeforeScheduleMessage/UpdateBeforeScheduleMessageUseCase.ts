import { IBeforeScheduleMessageRepository } from "../../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import {
  BeforeScheduleMessage,
  BeforeScheduleMessageDTO,
} from "../../../models/BeforeScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type UpdateBeforeScheduleMessageDTO = {
  id: string;
  userId: string;
  name?: string;
  minutesBeforeSchedule?: number;
  isActive?: boolean;
  messageTemplate?: {
    textTemplate: string;
  };
};

export class UpdateBeforeScheduleMessageUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute(
    dto: UpdateBeforeScheduleMessageDTO,
  ): Promise<BeforeScheduleMessageDTO> {
    const existing = await this.beforeScheduleMessageRepository.getById({
      id: dto.id,
      userId: dto.userId,
    });

    if (!existing) {
      throw new ApiError("Mensagem agendada não encontrada", 404);
    }

    if (dto.name !== undefined && !dto.name.trim()) {
      throw new ApiError("name não pode ser vazio", 400, "name");
    }

    const name = dto.name !== undefined ? dto.name.trim() : existing.name;
    const minutesBeforeSchedule =
      dto.minutesBeforeSchedule ?? existing.minutesBeforeSchedule;
    const isActive = dto.isActive ?? existing.isActive;
    const textTemplate =
      dto.messageTemplate?.textTemplate ?? existing.textTemplate;

    const messageTemplate = new MessageTemplate({ textTemplate });
    const beforeScheduleMessage = new BeforeScheduleMessage({
      id: existing.id,
      name,
      minutesBeforeSchedule,
      messageTemplate,
      isActive,
    });

    await this.beforeScheduleMessageRepository.update({
      id: dto.id,
      userId: dto.userId,
      name: dto.name !== undefined ? dto.name.trim() : undefined,
      minutesBeforeSchedule: dto.minutesBeforeSchedule,
      textTemplate: dto.messageTemplate?.textTemplate,
      isActive: dto.isActive,
    });

    const updatedDTO = beforeScheduleMessage.getDTO();

    this.appEventListener.emit("beforeScheduleMessageUpdate", {
      id: updatedDTO.id!,
      userId: dto.userId,
      name: updatedDTO.name,
      minutesBeforeSchedule: updatedDTO.minutesBeforeSchedule,
      isActive: updatedDTO.isActive,
    });

    return updatedDTO;
  }
}
