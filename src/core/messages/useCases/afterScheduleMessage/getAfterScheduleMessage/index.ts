import { GetAfterScheduleMessageUseCase } from "./GetAfterScheduleMessageUseCase";
import { afterScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const getAfterScheduleMessageUseCase = new GetAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
);

export { getAfterScheduleMessageUseCase };