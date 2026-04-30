import { GetBeforeScheduleMessageUseCase } from "../../useCases/beforeScheduleMessage/getBeforeScheduleMessage/GetBeforeScheduleMessageUseCase";
import { GetBeforeScheduleMessageController } from "./GetBeforeScheduleMessageController";
import { beforeScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";


const getBeforeScheduleMessageUseCase = new GetBeforeScheduleMessageUseCase(
  beforeScheduleMessageRepository,
);

const getBeforeScheduleMessageController = new GetBeforeScheduleMessageController(
  getBeforeScheduleMessageUseCase,
);

export { getBeforeScheduleMessageController };