import { beforeScheduleQueue } from "../../../../../queues/beforeScheduleMessage";
import { BeforeScheduleMessageRepository } from "../../../../../repositories/messages/BeforeScheduleMessageRepository";
import { KnexSchedulingRepository } from "../../../../../repositories/scheduling/KnexSchedulingRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { DeleteBeforeScheduleMessageUseCase } from "./DeleteBeforeScheduleMessageUseCase";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();
const schedulingRepository = new KnexSchedulingRepository();

const deleteBeforeScheduleMessageUseCase = new DeleteBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  schedulingRepository,
  beforeScheduleQueue,
  appEventListener,
);

export { deleteBeforeScheduleMessageUseCase };
