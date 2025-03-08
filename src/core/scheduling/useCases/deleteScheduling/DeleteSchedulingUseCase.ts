import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { appEventListener } from "../../../shared/observers/EventListener";

export class DeleteSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({ id, userId }: { id: string; userId: string }) {
    await this.SchedulingRepository.delete({ id, userId });
    appEventListener.emit("deleteSchedule", { scheduleId: id, userId });
  }
}
