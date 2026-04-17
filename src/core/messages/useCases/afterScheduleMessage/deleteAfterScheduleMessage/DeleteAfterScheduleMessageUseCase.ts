import { AfterScheduleQueue } from "../../../../../queues/afterScheduleMessage/AfterScheduleQueue";
import { IAfterScheduleMessageRepository } from "../../../../../repositories/messages/IAfterScheduleMessageRepository";
import { ISchedulingRepository } from "../../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { buildAfterScheduleMessageJobId } from "../../../utils/buildAfterScheduleMessageJobId";
import { AppEventListener } from "../../../../shared/observers/EventListener";

export class DeleteAfterScheduleMessageUseCase {
  constructor(
    private afterScheduleMessageRepository: IAfterScheduleMessageRepository,
    private schedulingRepository: ISchedulingRepository,
    private afterScheduleQueue: AfterScheduleQueue,
    private appEventListener: AppEventListener,
  ) {}

  async execute({ id, userId }: { id: string; userId: string }): Promise<void> {
    const existing = await this.afterScheduleMessageRepository.getById({
      id,
      userId,
    });

    if (!existing) {
      throw new ApiError("Mensagem agendada não encontrada", 404);
    }

    await this.afterScheduleMessageRepository.delete({ id, userId });

    this.appEventListener.emit("afterScheduleMessageDelete", { id });

    const scheduleIds = await this.schedulingRepository.listIdsByUserId({
      userId,
    });

    await Promise.all(
      scheduleIds.map((scheduleId) =>
        this.afterScheduleQueue.remove(
          buildAfterScheduleMessageJobId({
            userId,
            scheduleId,
            afterScheduleMessageId: id,
          }),
        ),
      ),
    );
  }
}
