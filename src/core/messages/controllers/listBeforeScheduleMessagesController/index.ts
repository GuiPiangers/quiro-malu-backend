import { ListBeforeScheduleMessagesUseCase } from "../../useCases/beforeScheduleMessage/listBeforeScheduleMessages/ListBeforeScheduleMessagesUseCase";
import { ListBeforeScheduleMessagesController } from "./ListBeforeScheduleMessagesController";
import { beforeScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";


const listBeforeScheduleMessagesUseCase = new ListBeforeScheduleMessagesUseCase(
  beforeScheduleMessageRepository,
);

const listBeforeScheduleMessagesController = new ListBeforeScheduleMessagesController(
  listBeforeScheduleMessagesUseCase,
);

export { listBeforeScheduleMessagesController };