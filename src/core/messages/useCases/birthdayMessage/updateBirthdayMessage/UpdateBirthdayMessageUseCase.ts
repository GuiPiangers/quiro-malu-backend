import {
  IBirthdayMessageRepository,
} from "../../../../../repositories/messages/IBirthdayMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import {
  BirthdayMessage,
  BirthdayMessageDTO,
} from "../../../models/BirthdayMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type UpdateBirthdayMessageDTO = {
  id: string;
  userId: string;
  name?: string;
  isActive?: boolean;
  sendTime?: string;
  messageTemplate?: {
    textTemplate: string;
  };
};

export class UpdateBirthdayMessageUseCase {
  constructor(
    private birthdayMessageRepository: IBirthdayMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute(dto: UpdateBirthdayMessageDTO): Promise<BirthdayMessageDTO> {
    const existing = await this.birthdayMessageRepository.getById({
      id: dto.id,
      userId: dto.userId,
    });

    if (!existing) {
      throw new ApiError("Campanha de aniversário não encontrada", 404);
    }

    if (dto.name !== undefined && !dto.name.trim()) {
      throw new ApiError("name não pode ser vazio", 400, "name");
    }

    if (
      dto.messageTemplate !== undefined &&
      !dto.messageTemplate.textTemplate?.trim()
    ) {
      throw new ApiError(
        "textTemplate é obrigatório",
        400,
        "messageTemplate.textTemplate",
      );
    }

    if (dto.sendTime !== undefined && !dto.sendTime.trim()) {
      throw new ApiError("sendTime não pode ser vazio", 400, "sendTime");
    }

    const name = dto.name !== undefined ? dto.name.trim() : existing.name;
    const textTemplate =
      dto.messageTemplate !== undefined
        ? dto.messageTemplate.textTemplate.trim()
        : existing.textTemplate;
    const isActive = dto.isActive !== undefined ? dto.isActive : existing.isActive;
    const sendTimeForMerge =
      dto.sendTime !== undefined ? dto.sendTime.trim() : existing.sendTime;

    const messageTemplate = new MessageTemplate({ textTemplate });
    const birthdayMessage = new BirthdayMessage({
      id: existing.id,
      name,
      messageTemplate,
      sendTime: sendTimeForMerge,
      isActive,
    });

    const updatedDTO = birthdayMessage.getDTO();

    const hasPatch =
      dto.name !== undefined ||
      dto.messageTemplate !== undefined ||
      dto.isActive !== undefined ||
      dto.sendTime !== undefined;

    await this.birthdayMessageRepository.update({
      id: dto.id,
      userId: dto.userId,
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.messageTemplate !== undefined
        ? { textTemplate: dto.messageTemplate.textTemplate.trim() }
        : {}),
      ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      ...(dto.sendTime !== undefined
        ? { sendTime: `${updatedDTO.sendTime}:00` }
        : {}),
    });

    if (hasPatch) {
      this.appEventListener.emit("birthdayMessageUpdate", {
        id: updatedDTO.id!,
        userId: dto.userId,
        name: updatedDTO.name,
        isActive: updatedDTO.isActive,
        sendTime: updatedDTO.sendTime,
      });
    }

    return updatedDTO;
  }
}
