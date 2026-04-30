import { GetAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/getAfterScheduleMessage/GetAfterScheduleMessageUseCase";
import { GetAfterScheduleMessageController } from "./GetAfterScheduleMessageController";
import { afterScheduleMessageRepository } from "../../../../repositories/messages/knexInstances";


const getAfterScheduleMessageUseCase = new GetAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
);

const getAfterScheduleMessageController = new GetAfterScheduleMessageController(
  getAfterScheduleMessageUseCase,
);

export { getAfterScheduleMessageController };