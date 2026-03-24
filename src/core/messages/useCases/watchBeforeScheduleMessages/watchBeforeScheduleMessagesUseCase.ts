import { IBeforeScheduleMessageRepository } from "../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { ApiError } from "../../../../utils/ApiError";
import { AppEventListener } from "../../../shared/observers/EventListener";

export class WatchBeforeScheduleMessagesUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute() {
    const configs = await this.beforeScheduleMessageRepository.listAll();

    for (const config of configs) {
      if (config.id == null)
        throw new ApiError("beforeScheduleMessage.id is required", 500);

      this.appEventListener.emit("beforeScheduleMessageCreate", {
        id: config.id,
        userId: config.userId,
        minutesBeforeSchedule: config.minutesBeforeSchedule,
        isActive: config.isActive,
      });
    }
  }
}
