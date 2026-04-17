import { AfterScheduleMessageRepository } from "../../../../../repositories/messages/AfterScheduleMessageRepository";
import { GetAfterScheduleMessageUseCase } from "./GetAfterScheduleMessageUseCase";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const getAfterScheduleMessageUseCase = new GetAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
);

export { getAfterScheduleMessageUseCase };
