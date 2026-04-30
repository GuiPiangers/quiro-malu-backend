import { ListAfterScheduleMessagesUseCase } from "./ListAfterScheduleMessagesUseCase";
import { afterScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const listAfterScheduleMessagesUseCase = new ListAfterScheduleMessagesUseCase(
  afterScheduleMessageRepository,
);

export { listAfterScheduleMessagesUseCase };