import { IAfterScheduleMessageRepository } from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { AppEventListener } from "../../../../shared/observers/EventListener";

export class WatchAfterScheduleMessagesUseCase {
  constructor(
    private afterScheduleMessageRepository: IAfterScheduleMessageRepository,
    private appEventListener: AppEventListener,
  ) {}

  async execute() {
    const configs = await this.afterScheduleMessageRepository.listAll();

    for (const config of configs) {
      if (config.id == null)
        throw new ApiError("afterScheduleMessage.id is required", 500);

      this.appEventListener.emit("afterScheduleMessageCreate", {
        id: config.id,
        userId: config.userId,
        name: config.name,
        minutesAfterSchedule: config.minutesAfterSchedule,
        isActive: config.isActive,
      });
    }
  }
}
