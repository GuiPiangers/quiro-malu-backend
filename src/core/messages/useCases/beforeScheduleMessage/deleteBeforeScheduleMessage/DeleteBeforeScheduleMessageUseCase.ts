import { BeforeScheduleQueue } from "../../../../../queues/beforeScheduleMessage/BeforeScheduleQueue";
import { IBeforeScheduleMessageRepository } from "../../../../../repositories/messages/IBeforeScheduleMessageRepository";
import { ISchedulingRepository } from "../../../../../repositories/scheduling/ISchedulingRepository";
import { ApiError } from "../../../../../utils/ApiError";
import { buildBeforeScheduleMessageJobId } from "../../../utils/buildBeforeScheduleMessageJobId";
import { AppEventListener } from "../../../../shared/observers/EventListener";

export class DeleteBeforeScheduleMessageUseCase {
  constructor(
    private beforeScheduleMessageRepository: IBeforeScheduleMessageRepository,
    private schedulingRepository: ISchedulingRepository,
    private beforeScheduleQueue: BeforeScheduleQueue,
    private appEventListener: AppEventListener,
  ) {}

  async execute({ id, userId }: { id: string; userId: string }): Promise<void> {
    const existing = await this.beforeScheduleMessageRepository.getById({
      id,
      userId,
    });

    if (!existing) {
      throw new ApiError("Mensagem agendada não encontrada", 404);
    }

    await this.beforeScheduleMessageRepository.delete({ id, userId });

    this.appEventListener.emit("beforeScheduleMessageDelete", { id });

    const scheduleIds = await this.schedulingRepository.listIdsByUserId({
      userId,
    });

    await Promise.all(
      scheduleIds.map((scheduleId) =>
        this.beforeScheduleQueue.remove(
          buildBeforeScheduleMessageJobId({
            userId,
            scheduleId,
            beforeScheduleMessageId: id,
          }),
        ),
      ),
    );
  }
}
