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

    const name = dto.name ?? existing.name;
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

    const updateDTO = beforeScheduleMessage.getDTO();

    await this.beforeScheduleMessageRepository.update({
      id: dto.id,
      userId: dto.userId,
      name: updateDTO.name ?? undefined,
      minutesBeforeSchedule: updateDTO.minutesBeforeSchedule,
      textTemplate: updateDTO.messageTemplate?.textTemplate,
      isActive: updateDTO.isActive,
    });

    this.appEventListener.emit("beforeScheduleMessageUpdate", {
      id: updateDTO.id!,
      userId: dto.userId,
      name: updateDTO.name,
      minutesBeforeSchedule: updateDTO.minutesBeforeSchedule,
      isActive: updateDTO.isActive,
    });

    return updateDTO;
  }
}
