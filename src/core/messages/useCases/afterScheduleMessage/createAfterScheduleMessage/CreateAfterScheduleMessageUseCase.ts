import {
  IAfterScheduleMessageRepository,
  SaveAfterScheduleMessageProps,
} from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";
import {
  AfterScheduleMessage,
  AfterScheduleMessageDTO,
} from "../../../models/AfterScheduleMessage";
import { MessageTemplate } from "../../../models/MessageTemplate";

export type CreateAfterScheduleMessageDTO = {
  userId: string;
  name: string;
  minutesAfterSchedule: number;
  isActive?: boolean;
  messageTemplate: {
    textTemplate: string;
  };
};

export class CreateAfterScheduleMessageUseCase {
  constructor(
    private afterScheduleMessageRepository: IAfterScheduleMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute(dto: CreateAfterScheduleMessageDTO): Promise<AfterScheduleMessageDTO> {
    const name = typeof dto.name === "string" ? dto.name.trim() : "";
    if (!name) {
      throw new ApiError("name é obrigatório", 400, "name");
    }

    const messageTemplate = new MessageTemplate({
      textTemplate: dto.messageTemplate.textTemplate,
    });

    const afterScheduleMessage = new AfterScheduleMessage({
      name,
      minutesAfterSchedule: dto.minutesAfterSchedule,
      messageTemplate,
      isActive: dto.isActive ?? true,
    });

    const afterScheduleMessageDTO = afterScheduleMessage.getDTO();

    const saveData: SaveAfterScheduleMessageProps = {
      userId: dto.userId,
      id: afterScheduleMessageDTO.id,
      name: afterScheduleMessageDTO.name,
      minutesAfterSchedule: afterScheduleMessageDTO.minutesAfterSchedule,
      textTemplate: afterScheduleMessageDTO.messageTemplate.textTemplate,
      isActive: afterScheduleMessageDTO.isActive,
    };

    await this.afterScheduleMessageRepository.save(saveData);

    this.appEventListener.emit("afterScheduleMessageCreate", {
      id: afterScheduleMessageDTO.id!,
      userId: dto.userId,
      name: afterScheduleMessageDTO.name,
      minutesAfterSchedule: afterScheduleMessageDTO.minutesAfterSchedule,
      isActive: afterScheduleMessageDTO.isActive,
    });

    return afterScheduleMessageDTO;
  }
}
