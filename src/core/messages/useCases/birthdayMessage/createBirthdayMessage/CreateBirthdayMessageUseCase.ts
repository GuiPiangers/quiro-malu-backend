import {
  IBirthdayMessageRepository,
  SaveBirthdayMessageProps,
} from "../../../../../repositories/messages/IBirthdayMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import {
  BirthdayMessage,
  BirthdayMessageDTO,
} from "../../../models/BirthdayMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type CreateBirthdayMessageDTO = {
  userId: string;
  name: string;
  isActive?: boolean;
  /** Horário de envio no dia do aniversário (HH:mm). Padrão: 09:00. */
  sendTime?: string;
  messageTemplate: {
    textTemplate: string;
  };
};

export class CreateBirthdayMessageUseCase {
  constructor(
    private birthdayMessageRepository: IBirthdayMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute(dto: CreateBirthdayMessageDTO): Promise<BirthdayMessageDTO> {
    const name = typeof dto.name === "string" ? dto.name.trim() : "";
    if (!name) {
      throw new ApiError("name é obrigatório", 400, "name");
    }

    const messageTemplate = new MessageTemplate({
      textTemplate: dto.messageTemplate.textTemplate,
    });

    const sendTimeRaw =
      typeof dto.sendTime === "string" && dto.sendTime.trim()
        ? dto.sendTime.trim()
        : "09:00";

    const birthdayMessage = new BirthdayMessage({
      name,
      messageTemplate,
      sendTime: sendTimeRaw,
      isActive: dto.isActive ?? true,
    });

    const birthdayMessageDTO = birthdayMessage.getDTO();

    const saveData: SaveBirthdayMessageProps = {
      userId: dto.userId,
      id: birthdayMessageDTO.id,
      name: birthdayMessageDTO.name,
      textTemplate: birthdayMessageDTO.messageTemplate.textTemplate,
      isActive: birthdayMessageDTO.isActive,
      sendTime: `${birthdayMessageDTO.sendTime}:00`,
    };

    await this.birthdayMessageRepository.save(saveData);

    this.appEventListener.emit("birthdayMessageCreate", {
      id: birthdayMessageDTO.id!,
      userId: dto.userId,
      name: birthdayMessageDTO.name,
      isActive: birthdayMessageDTO.isActive,
      sendTime: birthdayMessageDTO.sendTime,
    });

    return birthdayMessageDTO;
  }
}
