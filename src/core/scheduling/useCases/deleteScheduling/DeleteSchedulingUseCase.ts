import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import {
  appEventListener,
  IAppEventListener,
} from "../../../shared/observers/EventListener";

export class DeleteSchedulingUseCase {
  constructor(
    private SchedulingRepository: ISchedulingRepository,
    private readonly events: IAppEventListener = appEventListener,
  ) {}

  async execute({ id, userId }: { id: string; userId: string }) {
    await this.SchedulingRepository.delete({ id, userId });
    this.events.emit("deleteSchedule", { scheduleId: id, userId });
  }
}
