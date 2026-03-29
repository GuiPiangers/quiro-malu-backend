import { BeforeScheduleMessageRepository } from "../../../../repositories/messages/BeforeScheduleMessageRepository";
import { GetBeforeScheduleMessageUseCase } from "../../useCases/getBeforeScheduleMessage/GetBeforeScheduleMessageUseCase";
import { GetBeforeScheduleMessageController } from "./GetBeforeScheduleMessageController";

const beforeScheduleMessageRepository = new BeforeScheduleMessageRepository();

const getBeforeScheduleMessageUseCase = new GetBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
);

const getBeforeScheduleMessageController = new GetBeforeScheduleMessageController(
  getBeforeScheduleMessageUseCase,
);

export { getBeforeScheduleMessageController };
