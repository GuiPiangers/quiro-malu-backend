import { afterScheduleQueue } from "../../../../queues/afterScheduleMessage";
import { AfterScheduleMessageRepository } from "../../../../repositories/messages/AfterScheduleMessageRepository";
import { KnexSchedulingRepository } from "../../../../repositories/scheduling/KnexSchedulingRepository";
import { appEventListener } from "../../../shared/observers/EventListener";
import { DeleteAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/deleteAfterScheduleMessage/DeleteAfterScheduleMessageUseCase";
import { DeleteAfterScheduleMessageController } from "./DeleteAfterScheduleMessageController";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();
const schedulingRepository = new KnexSchedulingRepository();

const deleteAfterScheduleMessageUseCase = new DeleteAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
  schedulingRepository,
  afterScheduleQueue,
  appEventListener,
);

const deleteAfterScheduleMessageController = new DeleteAfterScheduleMessageController(
  deleteAfterScheduleMessageUseCase,
);

export { deleteAfterScheduleMessageController };
