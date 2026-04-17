import { AfterScheduleMessageRepository } from "../../../../repositories/messages/AfterScheduleMessageRepository";
import { GetAfterScheduleMessageUseCase } from "../../useCases/afterScheduleMessage/getAfterScheduleMessage/GetAfterScheduleMessageUseCase";
import { GetAfterScheduleMessageController } from "./GetAfterScheduleMessageController";

const afterScheduleMessageRepository = new AfterScheduleMessageRepository();

const getAfterScheduleMessageUseCase = new GetAfterScheduleMessageUseCase(
  afterScheduleMessageRepository,
);

const getAfterScheduleMessageController = new GetAfterScheduleMessageController(
  getAfterScheduleMessageUseCase,
);

export { getAfterScheduleMessageController };
