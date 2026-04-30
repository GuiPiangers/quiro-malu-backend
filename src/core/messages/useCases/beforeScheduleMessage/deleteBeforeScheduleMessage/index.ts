import { beforeScheduleQueue } from "../../../../../queues/beforeScheduleMessage";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { DeleteBeforeScheduleMessageUseCase } from "./DeleteBeforeScheduleMessageUseCase";
import { knexSchedulingRepository } from "../../../../../repositories/scheduling/knexInstances";
import { beforeScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";

const schedulingRepository = knexSchedulingRepository;

const deleteBeforeScheduleMessageUseCase = new DeleteBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
  schedulingRepository,
  beforeScheduleQueue,
  appEventListener,
);

export { deleteBeforeScheduleMessageUseCase };