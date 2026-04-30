import { afterScheduleQueue } from "../../../../queues/afterScheduleMessage";
import { appEventListener } from "../../../shared/observers/EventListener";
import { DeleteAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/deleteAfterScheduleMessage/DeleteAfterScheduleMessageUseCase";
import { DeleteAfterScheduleMessageController } from "./DeleteAfterScheduleMessageController";
import { knexSchedulingRepository } from "../../../../repositories/scheduling/knexInstances";
import { afterScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";

const schedulingRepository = knexSchedulingRepository;

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