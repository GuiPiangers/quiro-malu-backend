import { AfterScheduleMessageRepository } from "../../../../../repositories/messages/AfterScheduleMessageRepository";
import { ListAfterScheduleMessagesUseCase } from "./ListAfterScheduleMessagesUseCase";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const listAfterScheduleMessagesUseCase = new ListAfterScheduleMessagesUseCase(
  afterScheduleMessageRepository,
);

export { listAfterScheduleMessagesUseCase };
