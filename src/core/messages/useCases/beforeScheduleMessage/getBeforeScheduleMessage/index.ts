import { GetBeforeScheduleMessageUseCase } from "./GetBeforeScheduleMessageUseCase";
import { beforeScheduleMessageRepository } from "../../../../../repositories/messages/knexInstances";


const getBeforeScheduleMessageUseCase = new GetBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
);

export { getBeforeScheduleMessageUseCase };