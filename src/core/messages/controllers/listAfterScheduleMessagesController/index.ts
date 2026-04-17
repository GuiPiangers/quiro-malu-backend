import { AfterScheduleMessageRepository } from "../../../../repositories/messages/AfterScheduleMessageRepository";
import { ListAfterScheduleMessagesUseCase } from "../../useCases/afterScheduleMessage/listAfterScheduleMessages/ListAfterScheduleMessagesUseCase";
import { ListAfterScheduleMessagesController } from "./ListAfterScheduleMessagesController";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const listAfterScheduleMessagesUseCase = new ListAfterScheduleMessagesUseCase(
  afterScheduleMessageRepository,
);

const listAfterScheduleMessagesController = new ListAfterScheduleMessagesController(
  listAfterScheduleMessagesUseCase,
);

export { listAfterScheduleMessagesController };
