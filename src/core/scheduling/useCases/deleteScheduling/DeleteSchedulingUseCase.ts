import { ISchedulingRepository } from "../../../../repositories/scheduling/ISchedulingRepository";
import { schedulingObserver } from "../../../shared/observers/SchedulingObserver/SchedulingObserver";

export class DeleteSchedulingUseCase {
  constructor(private SchedulingRepository: ISchedulingRepository) {}

  async execute({ id, userId }: { id: string; userId: string }) {
    await this.SchedulingRepository.delete({ id, userId });
    schedulingObserver.emit("delete", { id, userId, patientId: "" });
  }
}
