import { afterScheduleQueue } from "../../../../../queues/afterScheduleMessage";
import { AfterScheduleMessageRepository } from "../../../../../repositories/messages/AfterScheduleMessageRepository";
import { KnexSchedulingRepository } from "../../../../../repositories/scheduling/KnexSchedulingRepository";
import { appEventListener } from "../../../../shared/observers/EventListener";
import { DeleteAfterScheduleMessageUseCase } from "./DeleteAfterScheduleMessageUseCase";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();
const schedulingRepository = new KnexSchedulingRepository();

const deleteAfterScheduleMessageUseCase = new DeleteAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  schedulingRepository,
  afterScheduleQueue,
  appEventListener,
);

export { deleteAfterScheduleMessageUseCase };
