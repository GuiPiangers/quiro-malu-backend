import { BeforeScheduleMessageRepository } from "../../../../../repositories/messages/BeforeScheduleMessageRepository";
import { GetBeforeScheduleMessageUseCase } from "./GetBeforeScheduleMessageUseCase";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();

const getBeforeScheduleMessageUseCase = new GetBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
);

export { getBeforeScheduleMessageUseCase };
