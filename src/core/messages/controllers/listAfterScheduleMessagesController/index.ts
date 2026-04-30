import { ListAfterScheduleMessagesUseCase } from "../../useCases/afterScheduleMessage/listAfterScheduleMessages/ListAfterScheduleMessagesUseCase";
import { ListAfterScheduleMessagesController } from "./ListAfterScheduleMessagesController";
import { afterScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";


const listAfterScheduleMessagesUseCase = new ListAfterScheduleMessagesUseCase(
  afterScheduleMessageRepository,
);

const listAfterScheduleMessagesController = new ListAfterScheduleMessagesController(
  listAfterScheduleMessagesUseCase,
);

export { listAfterScheduleMessagesController };